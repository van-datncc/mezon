import { MessageBox, IMessagePayload } from "@mezon/components";
import { useChat, useChatDirect } from "@mezon/core";
import { RootState } from "@mezon/store";
import { IMessage } from "@mezon/utils";
import { useCallback } from "react";
import { useSelector } from "react-redux";

export function ChannelMessageBox() {
    const { sendMessage } = useChat();
    const sessionUser = useSelector((state: RootState) => state.auth.session);
    const handleSend = useCallback(
        (mess: IMessagePayload) => {
            if (sessionUser) {
                const messageToSend: IMessage = {
                    ...mess,
                };
                sendMessage(messageToSend);
            } else {
                console.error("Session is not available");
            }
        },
        [sendMessage, sessionUser],
    );

    return (
        <div>
            <MessageBox onSend={handleSend} />
        </div>
    );
}

interface DirectIdProps {
    directParamId: string;
}
export function DirectMessageBox({ directParamId }: DirectIdProps) {
    const { sendDirectMessage } = useChatDirect(directParamId);
    const sessionUser = useSelector((state: RootState) => state.auth.session);
    const handleSend = useCallback(
        (mess: IMessagePayload) => {
            if (sessionUser) {
                const messageToSend: IMessage = {
                    ...mess,
                };
                sendDirectMessage(messageToSend);
            } else {
                console.error("Session is not available");
            }
        },
        [sendDirectMessage, sessionUser],
    );

    return (
        <div>
            <MessageBox onSend={handleSend} />
        </div>
    );
}
