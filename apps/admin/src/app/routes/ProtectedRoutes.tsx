import { Navigate, Outlet, useLoaderData } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLogin } from '@mezon/store';
import { IAuthLoaderData } from '../loader/authLoader';

const ProtectedRoutes = () => {
	const { isLogin: isLoginLoader, redirect } = useLoaderData() as IAuthLoaderData;
	const isLoginStore = useSelector(selectIsLogin);
	const isLogin = isLoginLoader && isLoginStore;

	if (!isLogin) {
		return <Navigate to={redirect || '/login'} replace />;
	}
	return <Outlet />;
};

export default ProtectedRoutes;
