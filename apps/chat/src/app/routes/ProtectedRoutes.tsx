import { stickerSettingActions, useAppDispatch } from '@mezon/store';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
	// const { isLogin: isLoginLoader, redirect } = useLoaderData() as IAuthLoaderData;
	// const isLoginStore = useSelector(selectIsLogin);
	// const isLogin = isLoginLoader && isLoginStore;
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(stickerSettingActions.fetchStickerByUserId({}));
	}, [dispatch]);

	// Comment for when Refresh Session Fail will retry, not Clear Session
	// if (!isLogin) {
	// 	dispatch(authActions.setLogout());
	// 	return <Navigate to={redirect || '/desktop/login'} replace />;
	// }

	return <Outlet />;
};

export default ProtectedRoutes;
