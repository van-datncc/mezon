import { selectIsLogin } from "@mezon/store";
import { useSelector } from "react-redux";

import { Navigate } from "react-router-dom";

const InitialRoutes = () => {
	const isLogin = useSelector(selectIsLogin);

	if(!isLogin) {
        return <Navigate to="/guess/login" replace />;
    }

    return <Navigate to="/direct" replace />;
};

export default InitialRoutes;