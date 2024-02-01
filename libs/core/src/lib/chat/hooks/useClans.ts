import { useSelector } from "react-redux";
import { selectAllClans, selectCurrentClan} from "@mezon/store";

export function useClans() {
    const clans = useSelector(selectAllClans);
    const currentClan = useSelector(selectCurrentClan);
    return {
        clans,
        currentClan
    };
}