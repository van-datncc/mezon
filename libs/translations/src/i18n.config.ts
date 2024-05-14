import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import * as languages from './languages';

const ns = Object.keys(Object.values(languages)[0]);
export const defaultNS = ns[0];

const resources = Object.entries(languages).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value,
    }),
    {},
);

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns,
    defaultNS,
    resources: {
        ...Object.entries(resources).reduce(
        (acc, [key, value]) => ({
            ...acc,
            [key]: value,
        }),
        {},
        ),
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
    compatibilityJSON: 'v3',
  });

export default i18n;
