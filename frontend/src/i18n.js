
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import mr from "./locales/mr.json";

i18n
  .use(LanguageDetector)          // auto-detect browser language
  .use(initReactI18next)          // bind to React
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      mr: { translation: mr },
    },
    fallbackLng: "en",            // default if detection fails
    interpolation: {
      escapeValue: false,         // React already escapes values
    },
    detection: {
      // look in localStorage first, then browser lang
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "sft-lang",
    },
  });

export default i18n;