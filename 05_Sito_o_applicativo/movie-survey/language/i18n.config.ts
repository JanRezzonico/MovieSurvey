import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./packs";


const deviceLanguage = 'en';

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources,
    lng: deviceLanguage,
    fallbackLng: "en",
    interpolation: {
        escapeValue: false, // not needed for react!!
    },
});

export default i18n;