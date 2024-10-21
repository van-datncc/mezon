import { onMessageListener, ToastController } from '@mezon/components';
import { fcmActions, selectIsLogin, useAppDispatch } from '@mezon/store';
import { MezonUiProvider } from '@mezon/ui';
import { notificationService } from '@mezon/utils';
import isElectron from 'is-electron';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
	const handleNewMessage = (payload: any) => {
		if (typeof payload === 'object' && payload !== null) {
			const message = payload.notification.body;
			const image = payload.notification.image;
			const title = payload.notification.title;

			toast(
				<div>
					<div className="flex items-center">
						{image && <img src={image} alt="Notification" className="min-w-10 min-h-10 size-10 rounded-full object-cover" />}
						<div className="ml-3">
							<span className="block font-semibold">{title}</span>
						</div>
					</div>
					<div>
						<p className="mt-1 ml-[10px]">{message}</p>
					</div>
				</div>,
				{
					onClick: () => {
						const fullLink = payload.data.link;
						const baseUrl = 'https://mezon.ai';
						const relativeLink = fullLink.replace(baseUrl, '');
						navigate(relativeLink);
					}
				}
			);
		}
		onMessageListener()
			.then(handleNewMessage)
			.catch((error: Error) => {
				console.error('Error listening for messages:', error);
			});
	};

	// TODO: move this to a firebase context
	useEffect(() => {
		if (!isElectron()) {
			return;
		}

		if (!isLogin) {
			notificationService.isActive && notificationService.close();
			return;
		}

		onMessageListener()
			.then(handleNewMessage)
			.catch((error: Error) => {
				console.error('Error listening for messages:', error);
			});

		dispatch(
			fcmActions.registFcmDeviceToken({
				tokenId: 'foo',
				deviceId: 'bar',
				platform: 'desktop'
			})
		).then((response): void => {
			const token = (response?.payload as { token: string })?.token;
			notificationService.connect(token);
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
