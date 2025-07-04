import { useApp } from '@mezon/core';
import { selectTheme } from '@mezon/store';
import { useTheme } from '@mezon/themes';
import { Icons } from '@mezon/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ThemeOptions = () => {
	const appearanceTheme = useSelector(selectTheme);
	const { setAppearanceTheme, systemIsDark } = useApp();
	const [themeChosen, setThemeChosen] = useState<string>(appearanceTheme);
	const { currentTheme, themes, changeTheme, isLoading } = useTheme();

	const onWindowMatch = () => {
		if (themeChosen === 'system') {
			if (systemIsDark.matches) {
				setAppearanceTheme('dark');
			} else {
				setAppearanceTheme('light');
			}
		}
	};
	useEffect(() => {
		onWindowMatch();
		const handleChange = () => {
			onWindowMatch();
		};
		systemIsDark.addEventListener('change', handleChange);
		return () => {
			systemIsDark.removeEventListener('change', handleChange);
		};
	}, [themeChosen, systemIsDark]);

	useEffect(() => {
		if (themeChosen !== 'system') {
			setAppearanceTheme(themeChosen);
		}
	}, [themeChosen, appearanceTheme, setAppearanceTheme]);

	const handleThemeColorClick = (themeName: string) => {
		changeTheme(themeName);
		setThemeChosen(themeName);
	};

	return (
		<div className="pt-10 flex flex-col gap-2">
			<div>Theme</div>
			{/* add theme */}
			<div className="mt-3 flex flex-col">
				{isLoading && <p className="text-xs text-gray-500 mt-2">Loading theme...</p>}
				<div className="flex flex-wrap gap-y-4 gap-x-[30px] mt-5">
					{themes.map((theme) => (
						<div key={theme.name} className="relative" onClick={() => handleThemeColorClick(theme.name)}>
							<div
								className={`aspect-square rounded-full cursor-pointer w-[60px] h-[60px] transition-all ${
									currentTheme === theme.name ? 'border-2 border-indigo-600' : ''
								} ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
								style={{
									background: theme.color
								}}
							/>
							<div
								className={`w-fit p-[2px] bg-indigo-600 absolute top-0 right-0 rounded-full ${
									currentTheme === theme.name ? 'block' : 'hidden'
								}`}
							>
								<Icons.CheckIcon />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ThemeOptions;
