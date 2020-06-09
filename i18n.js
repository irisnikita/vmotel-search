import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en: {
        translation: {
            'Welcome to React': 'Welcome to Reactdqwdwq and react-i18next',
            'vietnamese': 'Vietnamese',
            'english': 'English'
        }
    },
    vi: {
        translation: {
            'Welcome to React': 'Hello mọi người',
            'vietnamese': 'Tiếng Việt',
            'english': 'Tiếng Anh'
        }
    }
};

function getLocalStorage () {
    let defaultLang = 'vi';

    if (process.browser) {
        let lang = localStorage.getItem('lang');

        if (lang) {
            defaultLang = lang;
        } else {
            localStorage.setItem('lang', 'vi');
        }
    }

    return defaultLang;

}

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: getLocalStorage(),

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;