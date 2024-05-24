import en from "./packs/en.json";

const resources = {
    en: {
        translation: en,
        fullName: 'English'
    }
};

const availableLanguages = Object.entries(resources).map(([code, { fullName }]) => ({ code, fullName }));

export { resources, availableLanguages };
