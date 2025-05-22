import { selectTheme, useAppSelector } from '@mezon/store';
import { CSSProperties, useMemo } from 'react';

export function useMenuStyles() {
	const appearanceTheme = useAppSelector(selectTheme);
	const isLightMode = appearanceTheme === 'light';

	const menuStyles = useMemo(
		() =>
			({
				'--contexify-menu-bgColor': isLightMode ? '#FFFFFF' : '#111214',
				'--contexify-activeItem-bgColor': '#4B5CD6',
				'--contexify-rightSlot-color': '#6f6e77',
				'--contexify-activeRightSlot-color': '#fff',
				'--contexify-arrow-color': '#6f6e77',
				'--contexify-activeArrow-color': '#fff',
				'--contexify-itemContent-padding': '-3px',
				'--contexify-menu-radius': '2px',
				'--contexify-activeItem-radius': '2px',
				'--contexify-menu-minWidth': '188px',
				'--contexify-separator-color': '#ADB3B9'
			}) as CSSProperties,
		[isLightMode]
	);

	return { menuStyles, isLightMode };
}
