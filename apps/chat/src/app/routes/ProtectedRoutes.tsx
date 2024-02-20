import { selectIsLogin } from '@mezon/store';
import { useSelector } from 'react-redux';

import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
	const isLogin = useSelector(selectIsLogin);
	if (!isLogin) {
		return <Navigate to="/guess/login" replace />;
	}

	return <Outlet />;
};

export default ProtectedRoutes;
