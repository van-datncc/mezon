import { useSelector } from "react-redux";
import { selectAllMessages } from "@mezon/store";

export function useMessages() {
    const messages = useSelector(selectAllMessages);
    
    return {
        messages
    };
}