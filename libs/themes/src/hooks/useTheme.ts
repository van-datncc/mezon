import { useEffect, useState } from 'react';
import { AVAILABLE_THEMES, ThemeConfig, ThemeManager } from '../lib/ThemeManager';

export interface UseThemeReturn {
	currentTheme: string;
	themes: ThemeConfig[];
	isLoading: boolean;
	error: string | null;
}

export const useTheme = (): UseThemeReturn => {
	const [currentTheme, setCurrentTheme] = useState<string>(() => ThemeManager.getCurrentTheme());
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => {
				setError(null);
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [error]);

	return {
		currentTheme,
		themes: AVAILABLE_THEMES,
		isLoading,
		error
	};
};
