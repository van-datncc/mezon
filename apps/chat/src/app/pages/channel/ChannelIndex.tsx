import { useAppParams } from "@mezon/core";
import { selectDefaultChannelIdByClanId } from "@mezon/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function ChannelIndex() {
    const { serverId } = useAppParams();
    const defaultChannelId = useSelector(selectDefaultChannelIdByClanId(serverId || ''))

    if (!serverId) {
        return <Navigate to={`../../`} />
    }

    if (defaultChannelId) {
        return  <Navigate to={`../${defaultChannelId}`} />
    }

    return (<div>Loading channels...</div>)

}