import { appActions, authActions, selectAllAccount, useAppDispatch } from '@mezon/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const LogoutCallback = () => {
	const dispatch = useAppDispatch();
	const userProfile = useSelector(selectAllAccount);

	useEffect(() => {
		const logout = async () => {
			await dispatch(
				authActions.logOut({
					device_id: userProfile?.user?.username || '',
					platform: 'desktop'
				})
			);
			await dispatch(appActions.setIsShowSettingFooterStatus(false));
		};

		logout();
	}, [dispatch, userProfile]);

	return <div className="bg-[#313338] text-white w-screen h-screen flex justify-center items-center">Processing logout...</div>;
};

export default LogoutCallback;
