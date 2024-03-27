import { Outlet } from 'react-router-dom';
import { MezonUiProvider } from '@mezon/ui';
import { fcmActions, useAppDispatch } from '@mezon/store';
import { useEffect } from 'react';
import {  onMessageListener, requestForToken } from 'libs/components/src/lib/components/Firebase/firebase';
import { toast } from 'react-toastify';

const theme = 'dark';
const AppLayout = () => {
	const dispatch = useAppDispatch();
	useEffect(() => {
		requestForToken().then((token: string) => {
			dispatch(fcmActions.registFcmDeviceToken(token));
        }).catch((error: Error) => {
            console.error("Error fetching token:", error);
        });
	},[],);
	useEffect(() => {
		onMessageListener().then((payload: any) => {
			if (typeof payload === 'object' && payload !== null) {
					const content = JSON.parse(payload.notification.body).content
					const contentT = JSON.parse(content).t	
					toast.info(contentT)
				}
			
		}).catch((error: Error) => {
			console.error('Error listening for messages:', error);
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
