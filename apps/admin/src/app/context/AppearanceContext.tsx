import { safeJSONParse } from 'mezon-js';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AppearanceContextProps {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
}

interface AppearanceProviderProps {
	children: ReactNode;
}

const AppearanceContext = createContext<AppearanceContextProps | undefined>(undefined);

export const AppearanceProvider: React.FC<AppearanceProviderProps> = ({ children }) => {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
		const storedMode = localStorage.getItem('isDarkMode');
		return storedMode ? safeJSONParse(storedMode) : false;
	});

	const toggleDarkMode = () => {
		setIsDarkMode((prevMode) => {
			const newMode = !prevMode;
			localStorage.setItem('isDarkMode', JSON.stringify(newMode));
			return newMode;
		});
	};

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [isDarkMode]);

	return <AppearanceContext.Provider value={{ isDarkMode, toggleDarkMode }}>{children}</AppearanceContext.Provider>;
};

export const useAppearance = () => {
	const context = useContext(AppearanceContext);
	if (context === undefined) {
		throw new Error('useAppearance must be used within an AppearanceProvider');
	}
	return context;
};
