import {
	checkMaximizedState,
	closeWindow,
	listenToWindowStateChanges,
	maximizeWindow,
	minimizeWindow,
	selectHoveredButton,
	selectIsMaximized,
	selectIsWindowFocused,
	useAppDispatch,
	useAppSelector,
	windowControlsActions
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import React, { useCallback, useEffect } from 'react';

interface MacOSWindowControlsProps {
	className?: string;
}

export const MacOSWindowControls: React.FC<MacOSWindowControlsProps> = ({ className }) => {
	const dispatch = useAppDispatch();
	const isMaximized = useAppSelector(selectIsMaximized);
	const isWindowFocused = useAppSelector(selectIsWindowFocused);
	const hoveredButton = useAppSelector(selectHoveredButton);

	// Listen for window focus/blur events
	useEffect(() => {
		const handleFocus = () => dispatch(windowControlsActions.setIsWindowFocused(true));
		const handleBlur = () => dispatch(windowControlsActions.setIsWindowFocused(false));

		window.addEventListener('focus', handleFocus);
		window.addEventListener('blur', handleBlur);

		return () => {
			window.removeEventListener('focus', handleFocus);
			window.removeEventListener('blur', handleBlur);
		};
	}, [dispatch]);

	const handleMinimize = useCallback(() => {
		dispatch(minimizeWindow());
	}, [dispatch]);

	const handleMaximize = useCallback(() => {
		dispatch(maximizeWindow());
	}, [dispatch]);

	const handleClose = useCallback(() => {
		dispatch(closeWindow());
	}, [dispatch]);

	useEffect(() => {
		dispatch(checkMaximizedState());
		dispatch(listenToWindowStateChanges());
	}, [dispatch]);

	const buttonBaseClass =
		'w-3 h-3 rounded-full border-none cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out';

	const MacOSButton: React.FC<{
		onClick: () => void;
		buttonType: string;
		backgroundColor: string;
		title: string;
		icon: React.ReactNode;
	}> = ({ onClick, buttonType, backgroundColor, title, icon }) => (
		<button
			onClick={onClick}
			onMouseEnter={() => dispatch(windowControlsActions.setHoveredButton(buttonType))}
			onMouseLeave={() => dispatch(windowControlsActions.setHoveredButton(null))}
			className={buttonBaseClass}
			title={title}
			style={{ backgroundColor }}
		>
			{hoveredButton === buttonType && isWindowFocused && icon}
		</button>
	);

	return (
		<div
			className={`fixed top-3 left-3 flex items-center gap-2 z-[9999] ${className}`}
			style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
		>
			<MacOSButton onClick={handleClose} buttonType="close" backgroundColor="#ff5f57" title="Close" icon={<Icons.MacOSCloseIcon />} />
			<MacOSButton
				onClick={handleMinimize}
				buttonType="minimize"
				backgroundColor="#ffbd2e"
				title="Minimize"
				icon={<Icons.MacOSMinimizeIcon />}
			/>
			<MacOSButton
				onClick={handleMaximize}
				buttonType="maximize"
				backgroundColor="#28ca42"
				title={isMaximized ? 'Restore' : 'Maximize'}
				icon={<Icons.MacOSMaximizeIcon isMaximized={isMaximized} />}
			/>
		</div>
	);
};
