import { fcmActions, useAppDispatch } from '@mezon/store';
import { MezonUiProvider } from '@mezon/ui';
import { onMessageListener, requestForToken } from 'libs/components/src/lib/components/Firebase/firebase';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const theme = 'dark';
const AppLayout = () => {
	const dispatch = useAppDispatch();
	const handleNewMessage = (payload: any) => {
		if (typeof payload === 'object' && payload !== null) {
			const parts = payload.notification.body;
			toast.info(parts);
		}
		onMessageListener()
			.then(handleNewMessage)
			.catch((error: Error) => {
				console.error('Error listening for messages:', error);
			});
	};

	useEffect(() => {
		onMessageListener()
			.then(handleNewMessage)
			.catch((error: Error) => {
				console.error('Error listening for messages:', error);
			});
		requestForToken()
			.then((token) => {
				if (token) {
					dispatch(fcmActions.registFcmDeviceToken(token));
				}
			})
			.catch((error: Error) => {
				console.error('Error fetching token:', error);
			});
	}, []);
	return (
		<MezonUiProvider themeName={theme}>
			<div id="app-layout">
				<Outlet />
			</div>
		</MezonUiProvider>
	);
};

export default AppLayout;
