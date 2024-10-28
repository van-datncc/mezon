import { ToastController } from '@mezon/components';
import { fcmActions, selectIsLogin, useAppDispatch } from '@mezon/store';
import { MezonUiProvider } from '@mezon/ui';
import { notificationService } from '@mezon/utils';
import isElectron from 'is-electron';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import { IAppLoaderData } from '../loaders/appLoader';
const theme = 'dark';

const AppLayout = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const isLogin = useSelector(selectIsLogin);

	const { redirectTo } = useLoaderData() as IAppLoaderData;
	useEffect(() => {
		if (redirectTo) {
			navigate(redirectTo);
		}
	}, [redirectTo, navigate]);

	// TODO: move this to a firebase context
	useEffect(() => {
		if (!isElectron()) {
			return;
		}

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
				notificationService.connect(token);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [isLogin]);

	return (
		<MezonUiProvider themeName={theme}>
			<div id="app-layout">
				<ToastController />
				<Outlet />
			</div>
		</MezonUiProvider>
	);
};

export default AppLayout;
