import { useAppNavigation } from '@mezon/core';
import { authActions, selectIsLogin, useAppDispatch } from '@mezon/store';
import isElectron from 'is-electron';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function ApplicationsPage() {
    const { navigate } = useAppNavigation();
    const dispatch = useAppDispatch();
    const isLogin = useSelector(selectIsLogin);
    const deepLinkUrl = JSON.parse(localStorage.getItem('deepLinkUrl') as string);

    useEffect(() => {
        if (deepLinkUrl && isElectron()) {
            const data = JSON.parse(decodeURIComponent(deepLinkUrl));
            dispatch(authActions.setSession(data));
            localStorage.removeItem('deepLinkUrl');
        }
    }, [deepLinkUrl, dispatch]);

    useEffect(() => {
        if (isLogin) {
            navigate('/admin/applications');
        }
    }, [isLogin, navigate]);

    return (
        <div
            className="flex flex-1 flex-col items-center"
        >
            <div className='flex flex-row justify-between w-full'>
                <span className='text-[24px] font-medium'>Applications</span>
            </div>
        </div>
    );
}

export default ApplicationsPage;