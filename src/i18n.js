import i18n from 'i18next';
import i18nextReactNative from 'i18next-react-native-language-detector';
import translation from '../translation.json';

i18n
.use(i18nextReactNative)
.init({
  fallbackLng: 'en',
  debug: false,
  ns: [
    'common',
  ],
  defaultNS: 'common',
  fallbackNS: 'common',
  resources: translation,
  interpolation: {
    escapeValue: false,
  },
});
