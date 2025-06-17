# Actnxt Frontend application
This repository hosts the frontend of the Actnxt mobile application, and was developed by DTU Students \{names\} as our Software Technology Project course on our 4th semester at DTU.
## Structure
The structure is made like so and so...
## Packages
See Packages.json for the complete list of all packages installed either as packages imported in the application or depencies for said packages.
Use ```npm list``` for the list without the packages installed as dependencies.
## Useful commands for development
- run ```npm install ``` to reinstall all packages, useful if having issues after pulling latest commits
- run ```npm install --legacy-peer-deps``` to avoid installing peer dependencies, if certain packages cause problems
- run ```npm start``` to start the expo server and view the application while developing
- run ```eas build``` with the desired flags to build application
  - ```--platform \{android/ios\}``` choose which platform to build for
  - ```--profile \{production/preview/development\}``` choose which profile to build. Production creates a file ready to upload to the app store or play store. Preview creates an installable file that you can install on your phone or emulator to preview the application. Development creates an installable development build file that you can install on your phone or emulator to run along with the expo server, useful to make real time updates, like the expo go server, but able to use packages that does not work with expo go.
  - ``` --local``` if this flag set, the application will be built locally on your machine, this requires either a linux or macOS operating system, it will **not work on windows**. If it is not set, a build request will be sent to the expo server and it can be downloaded from the expo.dev website.
- run ``` npx expo prebuild``` to prebuild the application. Neccessary before creating a build.
- run ```npm list``` to get a list of all installed packages and versions installed
- run ```npm view {package name}``` to view details on a certain package. Usefull to see if there is a newer version available for install
- run ```npx jsdoc -c jsdoc.json``` to automatically update the documentation website after creating jsdoc documentation for any code.
