import { useEffect, useState } from 'react';

export const useWindowFocusState = () => {
	const [isFocusDesktop, setIsFocusDesktop] = useState(true);

	useEffect(() => {
		if (window?.electron) {
			const handleWindowFocused = () => {
				setIsFocusDesktop(true);
			};

			const handleWindowBlurred = () => {
				setIsFocusDesktop(false);
			};

			window.electron.onWindowBlurred(handleWindowBlurred);
			window.electron.onWindowFocused(handleWindowFocused);

			return () => {
				window.electron.removeListener('window-blurred', handleWindowBlurred);
				window.electron.removeListener('window-focused', handleWindowFocused);
			};
		}
	}, []);

	return { isFocusDesktop };
};
