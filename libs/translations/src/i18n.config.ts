import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import enTranslations from './languages/en/index';
import esTranslations from './languages/es/index';
import itTranslations from './languages/it/index';
import jpnTranslations from './languages/jpn/index';
import plTranslations from './languages/pl/index';
import ptTranslations from './languages/pt/index';
import ruTranslations from './languages/ru/index';
import ttTranslations from './languages/tt/index';
import viTranslations from './languages/vi/index';

export const defaultNS = 'common';
const defaultNamespaces = ['common', 'friends'];

const SUPPORTED_LNGS = ['en', 'vi', 'ru', 'es', 'ukr', 'tt', 'pt', 'it', 'jpn', 'kr', 'swe', 'blr'] as const;
type SupportedLng = (typeof SUPPORTED_LNGS)[number];
const isSupportedLng = (value: string): value is SupportedLng => (SUPPORTED_LNGS as readonly string[]).includes(value);

const timezoneDetector = {
	name: 'timezone',
	lookup() {
		const storedLang = localStorage.getItem('i18nextLng');

		if (
			storedLang &&
			(storedLang === 'vi' ||
				storedLang === 'en' ||
				storedLang === 'ru' ||
				storedLang === 'es' ||
				storedLang === 'tt' ||
				storedLang === 'pt' ||
				storedLang === 'jpn' ||
				storedLang === 'pl' ||
				storedLang === 'it')
		) {
			return undefined;
		}

		const browserLanguage = navigator.language || (navigator as Navigator & { userLanguage?: string }).userLanguage;
		if (!browserLanguage) return undefined;

		if (browserLanguage) {
			const languageCode = browserLanguage.toLowerCase();
			if (languageCode.startsWith('vi')) {
				return 'vi';
			}
			if (languageCode.startsWith('en')) {
				return 'en';
			}
			if (languageCode.startsWith('ru')) {
				return 'ru';
			}
			if (languageCode.startsWith('es')) {
				return 'es';
			}
			if (languageCode.startsWith('tt')) {
				return 'tt';
			}
			if (languageCode.startsWith('pt')) {
				return 'pt';
			}
			if (languageCode.startsWith('it')) {
				return 'it';
			}
			if (languageCode.startsWith('jpn')) {
				return 'jpn';
			}
			if (languageCode.startsWith('pl')) {
				return 'pl';
			}
		}

		return undefined;
	},
	cacheUserLanguage(lng: string) {
		if (
			lng &&
			(lng === 'vi' ||
				lng === 'en' ||
				lng === 'ru' ||
				lng === 'es' ||
				lng === 'tt' ||
				lng === 'pt' ||
				lng === 'it' ||
				lng === 'jpn' ||
				lng === 'pl' ||
				lng === 'fr' ||
				lng === 'ukr' ||
				lng === 'de' ||
				lng === 'fr' ||
				lng === 'kr' ||
				lng === 'swe' ||
				lng === 'blr')
		) {
			localStorage.setItem('i18nextLng', lng);
		}
	}
};

const languageDetector = new LanguageDetector();
languageDetector.addDetector(timezoneDetector);

type NamespaceBundle = Record<string, unknown>;
type LanguageBundle = Record<string, NamespaceBundle>;
const bundleCache = new Map<string, Promise<LanguageBundle>>();

const loadLanguageBundle = (language: string): Promise<LanguageBundle> => {
	let cached = bundleCache.get(language);
	if (cached) return cached;
	cached = (async () => {
		switch (language) {
			case 'en':
				return (await import('./languages/en/index')).default as LanguageBundle;
			case 'vi':
				return (await import('./languages/vi/index')).default as LanguageBundle;
			case 'ru':
				return (await import('./languages/ru/index')).default as LanguageBundle;
			case 'ukr':
				return (await import('./languages/ukr/index')).default as LanguageBundle;
			case 'es':
				return (await import('./languages/es/index')).default as LanguageBundle;
			case 'tt':
				return (await import('./languages/tt/index')).default as LanguageBundle;
			case 'pt':
				return (await import('./languages/pt/index')).default as LanguageBundle;
			case 'it':
				return (await import('./languages/it/index')).default as LanguageBundle;
			case 'jpn':
				return (await import('./languages/jpn/index')).default as LanguageBundle;
			case 'kr':
				return (await import('./languages/kr/index')).default as LanguageBundle;
			case 'swe':
				return (await import('./languages/swe/index')).default as LanguageBundle;
			case 'blr':
				return (await import('./languages/blr/index')).default as LanguageBundle;
			default:
				return {} as LanguageBundle;
		}
	})();
	bundleCache.set(language, cached);
	return cached;
};

i18n.use(languageDetector)
	.use(initReactI18next)
	.use(
		resourcesToBackend(async (language: string, namespace: string) => {
			const bundle = await loadLanguageBundle(language);
			return bundle[namespace] ?? {};
		})
	)
	.init({
		defaultNS,
		ns: defaultNamespaces,
		fallbackLng: 'en',
		supportedLngs: ['en', 'vi', 'ru', 'es', 'tt', 'pt', 'it', 'jpn', 'pl'],
		resources: {
			en: enTranslations,
			vi: viTranslations,
			ru: ruTranslations,
			es: esTranslations,
			tt: ttTranslations,
			pt: ptTranslations,
			it: itTranslations,
			jpn: jpnTranslations,
			pl: plTranslations
		},
		detection: {
			order: ['timezone', 'localStorage', 'navigator', 'htmlTag'],
			lookupLocalStorage: 'i18nextLng',
			caches: ['localStorage']
		},
		load: 'currentOnly',
		debug: false,
		interpolation: {
			escapeValue: false
		},
		compatibilityJSON: 'v3',
		react: {
			useSuspense: false
		},
		partialBundledLanguages: true
	});

export default i18n;
