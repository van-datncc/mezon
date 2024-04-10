import { Outlet } from 'react-router-dom';
import { MezonUiProvider } from '@mezon/ui';
import { fcmActions, useAppDispatch } from '@mezon/store';
import { useEffect } from 'react';
import {  onMessageListener, requestForToken } from 'libs/components/src/lib/components/Firebase/firebase';
import { toast } from 'react-toastify';

const theme = 'dark';
const AppLayout = () => {
	const dispatch = useAppDispatch();
	const handleNewMessage = (payload: any) => {
        if (typeof payload === 'object' && payload !== null) {
			
            const parts = payload.notification.body.split('\n');
            const content = parts[1].split(': ')[1];
            toast.info(content);
        }
        onMessageListener().then(handleNewMessage).catch((error: Error) => {
            console.error('Error listening for messages:', error);
        });
    };

    useEffect(() => {
        onMessageListener().then(handleNewMessage).catch((error: Error) => {
            console.error('Error listening for messages:', error);
        });
        requestForToken().then((token) => {
            if (token) {
                dispatch(fcmActions.registFcmDeviceToken(token as string));
            }
        }).catch((error: Error) => {
            console.error("Error fetching token:", error);
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
