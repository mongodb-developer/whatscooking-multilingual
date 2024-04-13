// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Language files
import translationEN from './locales/en/translation.json';
import translationID from './locales/id/translation.json';
import translationJP from './locales/jp/translation.json';
import translationTH from './locales/th/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  id: {
    translation: translationID,
  },
  jp: {
    translation: translationJP,
  },
  th: {
    translation: translationTH,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
