import { useSelector } from "react-redux";
import { selectAllThreads } from "@mezon/store";

export function useThreads() {
    const threads = useSelector(selectAllThreads);
    
    return {
        threads
    };
}