import { useEffect, useState } from 'react';
import { Icons } from '../../../components';
import { useApp } from '@mezon/core';

const ThemeOptions = () => {
	const { appearanceTheme, setAppearanceTheme } = useApp();
	const [themeChosen, setThemeChosen] = useState<string>('dark');

	const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)");
	
	const onWindowMatch = () =>{
		if(themeChosen === "system" && systemIsDark.matches){
			setAppearanceTheme("dark");
		}else if (themeChosen === "system" && !systemIsDark.matches){
			setAppearanceTheme("light");
		}
	}

    useEffect(()=>{
		setAppearanceTheme(themeChosen);
		console.log(appearanceTheme);
	}, [themeChosen, appearanceTheme, setAppearanceTheme]);

	onWindowMatch();
	return (
		<div className="pt-10">
			<div>Theme</div>
			<div className="theme-container flex gap-[30px] mt-3">
				<div
					className={`light-theme aspect-square bg-white w-[60px] rounded-full border border-solid cursor-pointer relative ${themeChosen === 'light' ? 'border-indigo-600 border-2': ''}`}
					onClick={() => setThemeChosen('light')}
				>
					<div className={`checked-theme w-fit p-[2px] bg-indigo-600 absolute top-0 right-0 rounded-full ${themeChosen === 'light' ? 'block' : 'hidden'}`}>
						<Icons.CheckIcon />
					</div>
				</div>
				<div
					className={`dark-theme aspect-square bg-bgSecondary w-[60px] rounded-full border border-solid cursor-pointer relative ${themeChosen === 'dark' ? 'border-indigo-600 border-2': ''}`}
					onClick={() => setThemeChosen('dark')}
				>
					<div className={`checked-theme w-fit p-[2px] bg-indigo-600 absolute top-0 right-0 rounded-full ${themeChosen === 'dark' ? 'block' : 'hidden'}`}>
						<Icons.CheckIcon />
					</div>
				</div>
				<div
					className={`system-theme aspect-square bg-bgSecondary w-[60px] rounded-full border border-solid cursor-pointer flex justify-center items-center relative ${themeChosen === 'system' ? 'border-indigo-600 border-2': ''}`}
					onClick={() => setThemeChosen('system')}
				>
					<Icons.SpinArrowIcon />
					<div className={`checked-theme w-fit p-[2px] bg-indigo-600 absolute top-0 right-0 rounded-full ${themeChosen === 'system' ? 'block' : 'hidden'}`}>
						<Icons.CheckIcon />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ThemeOptions;
