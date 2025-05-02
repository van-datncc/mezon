import { selectAllAuth, selectIsLogin } from '@mezon/store';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLoaderData } from 'react-router-dom';
import { IAuthLoaderData } from '../loader/authLoader';

const ProtectedRoutes = () => {
	const { isLogin: isLoginLoader, redirect } = useLoaderData() as IAuthLoaderData;
	const isLoginStore = useSelector(selectIsLogin);
	const { redirectUrl } = useSelector(selectAllAuth);
	const isLogin = isLoginLoader && isLoginStore;

	if (!isLogin) {
		return <Navigate to={redirectUrl || redirect || '/login'} replace />;
	}

	return <Outlet />;
};

export default ProtectedRoutes;
