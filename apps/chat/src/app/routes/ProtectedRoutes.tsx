import { selectIsLogin } from "@mezon/store";
import React from "react";
import { useSelector } from "react-redux";

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
	const isLogin = useSelector(selectIsLogin);

	return isLogin ? <Outlet /> : <Navigate to="/login"  replace />;
};

export default ProtectedRoutes;