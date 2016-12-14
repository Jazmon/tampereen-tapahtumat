// @flow
import {
  AppRegistry,
} from 'react-native';
import newRelic from 'react-native-newrelic';

import npmPackage from './package.json';
import Root from './src/Root';

if (!__DEV__) {
  newRelic.init({
    overrideConsole: true,
    reportUncaughtExceptions: true,
    globalAttributes: {
      version: npmPackage.version,
    },
  });
}

AppRegistry.registerComponent('TampereenTapahtumat', () => Root);
