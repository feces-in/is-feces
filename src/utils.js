const fs = require("fs")
const colors = require('ansi-colors');

const BROWNLIST_URL = "https://raw.githubusercontent.com/feces-in/brownlist/master/brownlist.txt"
const BROWNLIST_CACHE_DURATION = 24 * 60 * 60 * 1000;

let isFeces = {}

function smellOutTheFeces(pkg, levels) {
  if (pkg.feces) return pkg.feces
  pkg.feces = []

  for (let name in pkg.requires || {}) {
    let dependency = levels.map(deps => deps[name]).filter(dep => dep)[0]
    if (!dependency) throw new Error("Could not find installed dependency for: " + name + "@" + requirements[name])

    smellOutTheFeces(
        dependency,
        [dependency.dependencies || {}].concat(levels))

    if (isFeces[name] || dependency.feces.length > 0) {
      pkg.feces.push({
        name: name,
        version: dependency.version,
        dependencies: dependency.feces || []
      })
    }
  }

  return pkg.feces
}

function showTheFeces(feces, notLast = []) {
  if (feces.length == 0) {
    console.log("└─ No feces found!")
  }

  notLast = notLast.concat(false)
  for (let i = 0; i < feces.length; ++i) {
    let faeces = feces[i]
    notLast[notLast.length-1] = i < feces.length-1

    console.log(padding(notLast),
     isFeces[faeces.name]
     ? colors.white(faeces.name + "@" + faeces.version + " 💩💩💩")
     : colors.gray(faeces.name + "@" + faeces.version))

    if (faeces.dependencies.length > 0)
      showTheFeces(faeces.dependencies, notLast)
  }
}

function padding(notLastAll) {
  return notLastAll.map((notLast, index) => {
    if (index == notLastAll.length - 1) {
      return notLast ? " ├─" : " └─"
    } else {
      return notLast ? " │ " : "   "
    }
  }).join("")
}

function downloadBrownList(localPath, callback) {
  let file;
  function done(error) {
    if (file && error) fs.unlink(localPath, () => callback(error));
    else callback(error)
  }

  try {
    console.log("Downloading brownlist from github.")
    require('https').get(BROWNLIST_URL, (response) => {
      if (response.statusCode !== 200) {
        return done(new Error("Error: Could not update brownlist."))
      }
      file = fs.createWriteStream(localPath);
      response.pipe(file);
      file.on('finish', () => {
        file.close(done);
      });
    }).on('error', done);
  }
  catch (error) {
    done(error)
  }
}

function loadBrownList(callback, noDownload = false) {
  try {
    const path = require("path")
    const localPath = path.join(__dirname, "/../brownlist.txt")
    const exists = fs.existsSync(localPath)
    const stat = exists && fs.statSync(localPath)
    if (!noDownload && (!exists || new Date() - stat.mtime > BROWNLIST_CACHE_DURATION)) {
      return downloadBrownList(localPath, (error) => {
        if (error) {
          if (!exists) return callback(error)
          else console.log(error.message)
        }
        loadBrownList(callback, true)
      })
    }

    const list = fs.readFileSync(localPath, "utf8").split("\n")
    isFeces = {}
    for (item of list) {
      if (item) isFeces[item] = true
    }
  }
  catch (e) {
    return callback(new Error("Error loading brownlist: " + e.message))
  }
  callback()
}

function loadJson(filename) {
  try {
    return require(filename)
  }
  catch (e) {
    throw new Error("Cannot load file " + filename)
  }
}

module.exports = {
  loadJson: loadJson,
  smellOutTheFeces: smellOutTheFeces,
  showTheFeces: showTheFeces,
  loadBrownList: loadBrownList
}
