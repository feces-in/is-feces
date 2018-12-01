#!/usr/bin/env node

try {
  const path = require("path")
  const { loadJson, loadBrownList, smellOutTheFeces, showTheFeces } = require("./utils")

  const pathArg = process.argv[2] || "."
  const basePath = path.isAbsolute(pathArg) ? pathArg : path.join(process.cwd(), pathArg)
  const lockFile = loadJson(path.join(basePath, "./package-lock.json"))
  const packageFile = loadJson(path.join(basePath, "./package.json"))

  loadBrownList(error => {
    if (error) return printHelp(error)
    
    console.log(packageFile.name + "@" + packageFile.version)
    const feces = smellOutTheFeces(packageFile.dependencies, [lockFile.dependencies])
    showTheFeces(feces)
    process.exit(feces.length)
  })
}
catch(e) {
  printHelp(e)
}

function printHelp(errorMessage) {
  console.log("is-feces - Find feces in your dependencies")
  if (errorMessage) {
    console.log("")
    console.error(errorMessage)
    process.exit(1)
  }
}
