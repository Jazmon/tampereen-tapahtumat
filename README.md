# Tampereen Tapahtumat

Tampereen Tapahtumat is a map that shows all the events nearby in Tampere in the upcoming week.

## Install
* Coming Soon™ to Google Play Store near you

## Contributing

### Install dependencies
* Install node
* Clone this repo
* Inside the cloned folder run `npm install`

#### iOS
* Have Xcode v7.0 or higher installed

#### Android
* Have Android Studio or at least Android SDK installed
  * Build tools v 23.0.3, 23.0.2 and 23.0.1
  * Platform tools v >=23.1

### Running the Project on Android
* Have a phone connected and debugging enabled or an emulator running
* Run `react-native run-android`
* To see logs run `react-native log-android`
* You can view the developer menu by:
  * shaking the device
  * pressing `r` twice
  * `ctrl + m`
* If you need to reverse requests (not done automagically for some reason), run `adb reverse tcp:8081 tcp:8081`

### Running the Project on iOS
* Run `react-native run-ios`
* Logs can be seen with `react-native log-ios`
* Developer menu can be accessed by pressing `⌘ + D`, `ctrl + ⌘ + z`
* Reloading can be done by pressing `⌘ + R`

### Running (on both platforms)
* If you need to run the dev server manually, you can do so by running `react-native start`

### Adding new native libraries
* When installing new libraries to the project, you may need to install their native components
* Most can be installed with `react-native link`
* Some require manual installing, in which case refer to their documentation

### Recommended enviroment for developing
* Editor: Atom w/ nuclide
  * [Atom](https://atom.io)
  * [Nuclide](https://nuclide.io/)
  * [Watchman](https://facebook.github.io/watchman/)
  * [linter-eslint](https://github.com/AtomLinter/linter-eslint)
* [NVM](https://github.com/creationix/nvm) to manage node versions
