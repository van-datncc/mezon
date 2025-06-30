import { useApp } from '@mezon/core';
import { selectTheme } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { useTheme } from 'libs/themes/src/hooks/useTheme';
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

	return (
		<div className="pt-10 flex flex-col gap-2">
			<div>Theme</div>
			<div className="theme-container flex gap-[30px] mt-3">
				<div
					className={`light-theme aspect-square bg-white w-[60px] rounded-full border dark:border-white border-black border-solid cursor-pointer relative ${themeChosen === 'light' ? 'border-indigo-600 border-2' : ''}`}
					onClick={() => setThemeChosen('light')}
				>
					<div
						className={` w-fit p-[2px] bg-indigo-600 absolute text-white top-0 right-0 rounded-full ${themeChosen === 'light' ? 'block' : 'hidden'}`}
					>
						<Icons.CheckIcon />
					</div>
				</div>
				<div
					className={`dark-theme aspect-square bg-bgSecondary w-[60px] rounded-full border border-solid cursor-pointer relative ${themeChosen === 'dark' ? 'border-indigo-600 border-2' : ''}`}
					onClick={() => setThemeChosen('dark')}
				>
					<div
						className={` w-fit p-[2px] bg-indigo-600 absolute top-0 right-0 rounded-full ${themeChosen === 'dark' ? 'block' : 'hidden'}`}
					>
						<Icons.CheckIcon />
					</div>
				</div>

				<div
					className={`system-theme aspect-square bg-bgSecondary w-[60px] rounded-full border border-solid cursor-pointer flex justify-center items-center relative ${themeChosen === 'system' ? 'border-indigo-600 border-2' : ''}`}
					onClick={() => setThemeChosen('system')}
				>
					<Icons.SpinArrowIcon />
					<div
						className={` w-fit p-[2px] bg-indigo-600 absolute text-white top-0 right-0 rounded-full ${themeChosen === 'system' ? 'block' : 'hidden'}`}
					>
						<Icons.CheckIcon />
					</div>
				</div>
			</div>

			{/* add theme */}
			<div className="mt-3 flex flex-col">
				<div className="">Theme Colors</div>
				<div className="flex items-center justify-between">
					<p className="text-xs ">
						Unlock more themes with <span className="text-blue-500">Nitro</span>.
					</p>
					<div className="flex gap-2">
						<button className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center hover:opacity-90">
							<Icons.CheckIcon className="mr-1" /> Unlock with Nitro
						</button>
					</div>
				</div>
				<div className="flex flex-wrap gap-y-4 gap-x-[30px] mt-5">
					{themes.map((item, index) => (
						<div key={index} className="relative" onClick={() => setThemeChosen(index.toString())}>
							<div
								className={`aspect-square rounded-full cursor-pointer w-[60px] h-[60px] ${themeChosen === index.toString() ? 'border-2 border-indigo-600' : ''}`}
								style={{
									background: item.color
								}}
							/>
							<div
								className={`w-fit p-[2px] bg-indigo-600 absolute top-0 right-0 rounded-full ${themeChosen === index.toString() ? 'block' : 'hidden'}`}
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
