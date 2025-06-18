import { appActions, selectCurrentLanguage, useAppDispatch, useAppSelector } from '@mezon/store-mobile';
import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

enum LanguageBase {
	VI = 'vi',
	EN = 'en'
}

const LanguageContext = createContext({
	currentLanguage: 'en',
	setLanguage: (lang: LanguageBase) => {}
});

export const LanguageProvider = ({ children }) => {
	const dispatch = useAppDispatch(); 
	const currentLanguage = useAppSelector(selectCurrentLanguage);
	const { i18n } = useTranslation();

	useEffect(() => {
		if (i18n.language !== currentLanguage) {
			i18n.changeLanguage(currentLanguage);
		}
	}, [currentLanguage, i18n]);

	const setLanguage = useCallback(
		(lang: LanguageBase) => {
			dispatch(appActions.setLanguage(lang));
			i18n.changeLanguage(lang);
		},
		[dispatch, i18n]
	);

	const contextValue = useMemo(() => ({ currentLanguage, setLanguage }), [currentLanguage, setLanguage]);
	return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};
