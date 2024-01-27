import { selectDefaultClanId } from "@mezon/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function ClanIndex() {
    const defaultClanId = useSelector(selectDefaultClanId)

    if (defaultClanId) {
        return  <Navigate to={`./${defaultClanId}`} />
    }

    return (<div>Loading clans...</div>)

}