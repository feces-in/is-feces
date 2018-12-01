is-feces - Find feces in your dependencies

# Installation

```
npm install is-feces -g
```

# Usage

Run the `is-feces` CLI tool by passing as first argument the path to a directory containing both a `package.json` and `package-lock.json`. It will default to the current directory.

```
~/test$ is-feces

test@1.0.0
 ├─ is-even@1.0.0 💩💩💩
 │  └─ is-odd@0.1.2 💩💩💩
 │     └─ is-number@3.0.0 💩💩💩
 └─ npm-registry-client@8.6.0
    └─ npmlog@4.1.2
       └─ gauge@2.7.4
          ├─ object-assign@4.1.1 💩💩💩
          ├─ string-width@1.0.2 💩💩💩
          │  ├─ is-fullwidth-code-point@1.0.0
          │  │  └─ number-is-nan@1.0.1 💩💩💩
          │  └─ strip-ansi@3.0.1 💩💩💩
          ├─ strip-ansi@3.0.1 💩💩💩
          └─ wide-align@1.1.3
             └─ string-width@1.0.2 💩💩💩
                ├─ is-fullwidth-code-point@1.0.0
                │  └─ number-is-nan@1.0.1 💩💩💩
                └─ strip-ansi@3.0.1 💩💩💩
```

# The brownlist

The brownlist contains a list of all known feces.

Please help by suggesting more: https://github.com/feces-in/brownlist/issues
