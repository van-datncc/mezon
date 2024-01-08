import { useSelector } from "react-redux";
import { selectAllClans } from "@mezon/store";

export function useClans() {
    const clans = useSelector(selectAllClans);
    
    return {
        clans
    };
}