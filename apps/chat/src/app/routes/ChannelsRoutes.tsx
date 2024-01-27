import { selectCurrentChannelId, selectCurrentClanId, selectDefaultChannelIdByClanId } from "@mezon/store";
import { useSelector } from "react-redux";

import { Navigate, Outlet } from "react-router-dom";

const ChannelsRoutes = () => {
    const currentClanId = useSelector(selectCurrentClanId)
    const currentChannelId = useSelector(selectCurrentChannelId);
    const defaultChannelId = useSelector(selectDefaultChannelIdByClanId(currentClanId || ''));

    if (!currentClanId) {
        return <Navigate to={'../../'} />
    }

    if(!currentChannelId) {
        if (defaultChannelId) {
            return <Navigate to={``} />
        }

        // eslint-disable-next-line react/jsx-no-useless-fragment
        return (<></>)
    }

    return <Outlet />
};

export default ChannelsRoutes;