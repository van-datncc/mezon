import { MezonUiProvider } from '@mezon/ui';
import { ToastController } from '@mezon/components';
import { Outlet } from 'react-router-dom';
import { AppearanceProvider } from '../context/AppearanceContext';
const theme = 'dark';
const AppLayout = () => {
    return (
        <MezonUiProvider>
            <AppearanceProvider>
                <div id="app-layout">
                    <ToastController />
                    <Outlet />
                </div>
            </AppearanceProvider>
        </MezonUiProvider>
    );
};

export default AppLayout;
