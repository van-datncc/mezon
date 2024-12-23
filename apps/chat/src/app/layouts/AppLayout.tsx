import { ToastController } from '@mezon/components';
import { useEscapeKey } from '@mezon/core';
import { fcmActions, handleTopicNotification, selectAllAccount, selectIsLogin, useAppDispatch } from '@mezon/store';
import { Icons, MezonUiProvider } from '@mezon/ui';
import {
	CLOSE_APP,
	IMAGE_WINDOW_TITLE_BAR_ACTION,
	MAXIMIZE_WINDOW,
	MINIMIZE_WINDOW,
	TITLE_BAR_ACTION,
	UNMAXIMIZE_WINDOW,
	isLinuxDesktop,
	isWindowsDesktop,
	notificationService
} from '@mezon/utils';
import isElectron from 'is-electron';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { IAppLoaderData } from '../loaders/appLoader';
const theme = 'dark';

type TitleBarProps = {
	eventName: string;
};

const TitleBar: React.FC<TitleBarProps> = ({ eventName }) => {
	const handleMinimize = () => {
		window.electron.send(eventName, MINIMIZE_WINDOW);
	};
	useEffect(() => {
		document.body.classList.add('overflow-hidden');
	}, []);

	const handleMaximize = () => {
		window.electron.send(eventName, MAXIMIZE_WINDOW);
	};

	const handleClose = () => {
		window.electron.send(eventName, CLOSE_APP);
	};

	const handleDoubleClick = () => {
		window.electron.send(eventName, UNMAXIMIZE_WINDOW);
	};

	return (
		<header id="titlebar" className={`dark:bg-bgTertiary bg-bgLightTertiary`} onDoubleClick={handleDoubleClick}>
			<div id="drag-region">
				<div className="dark:text-white text-colorTextLightMode ml-3 text-[15.15px] leading-[26.58px] font-semibold text-[#FFFFFF]">
					Mezon
				</div>
				<div id="window-controls">
					<div
						className="button window-hover cursor-pointer dark:hover:bg-bgModifierHover hover:bg-bgLightModeButton"
						id="min-button"
						onClick={handleMinimize}
					>
						<div className="w-fit flex flex-col items-center gap-2 text-bgPrimary dark:text-[#a8a6a6] group">
							<Icons.WindowMinimize className="w-[14px]" />
						</div>
					</div>
					<div
						className="button window-hover cursor-pointer dark:hover:bg-bgModifierHover hover:bg-bgLightModeButton"
						id="restore-button"
						onClick={handleMaximize}
					>
						<div className="w-fit flex flex-col items-center gap-2 text-bgPrimary dark:text-[#a8a6a6] group">
							<Icons.WindowZoom className="w-[10px]" />
						</div>
					</div>
					<div
						className="button window-hover-close cursor-pointer dark:hover:bg-bgModifierHover hover:bg-bgLightModeButton"
						id="close-button"
						onClick={handleClose}
					>
						<div className="w-fit flex flex-col items-center gap-2 text-bgPrimary dark:text-[#a8a6a6] group">
							<Icons.CloseButton className="w-[14px]" />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

const AppLayout = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const isLogin = useSelector(selectIsLogin);
	const currentUserId = useSelector(selectAllAccount)?.user?.id;
	const location = useLocation();
	const urlParams = new URLSearchParams(location.search);
	const viewMode = urlParams.get('viewMode');
	const { redirectTo } = useLoaderData() as IAppLoaderData;
	useEffect(() => {
		if (redirectTo) {
			navigate(redirectTo);
		}
	}, [redirectTo, navigate]);

	useEffect(() => {
		currentUserId && notificationService.setCurrentUserId(currentUserId);
	}, [currentUserId]);

	// TODO: move this to a firebase context
	useEffect(() => {
		if (!isLogin) {
			notificationService.isActive && notificationService.close();
			return;
		}

		dispatch(
			fcmActions.registFcmDeviceToken({
				tokenId: 'foo',
				deviceId: 'bar',
				platform: 'desktop'
			})
		)
			.then((response): void => {
				const token = (response?.payload as { token: string })?.token;
				notificationService.connect(token, (msg) => {
					dispatch(handleTopicNotification({ msg }));
				});
			})
			.catch((error) => {
				console.error(error);
			});
	}, [isLogin]);

	useEscapeKey(() => {
		if (isElectron() && viewMode === 'image') {
			window.electron.send(IMAGE_WINDOW_TITLE_BAR_ACTION, CLOSE_APP);
		}
	});

	return (
		<MezonUiProvider themeName={theme}>
			<div id="app-layout">
				{(isWindowsDesktop || isLinuxDesktop) && (
					<TitleBar eventName={viewMode === 'image' ? IMAGE_WINDOW_TITLE_BAR_ACTION : TITLE_BAR_ACTION} />
				)}
				<ToastController />
				<Outlet />
			</div>
		</MezonUiProvider>
	);
};

export default AppLayout;
