import { selectCurrentClanId, selectDefaultClanId } from "@mezon/store";
import { useSelector } from "react-redux";

import { Navigate, Outlet } from "react-router-dom";

const ClansRoutes = () => {
    const currentClanId = useSelector(selectCurrentClanId);
    const defaultClanId = useSelector(selectDefaultClanId);

    if (!currentClanId && defaultClanId) {
        return <Navigate to={`./${defaultClanId}`} />
    }

    return <Outlet />
};

export default ClansRoutes;