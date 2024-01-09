import { MessageBox, IMessagePayload } from "@mezon/components"
import { useChat } from "@mezon/core"
import { IMessage } from "@mezon/utils"
import { useCallback } from "react"

export function ChannelMessageBox() {
    const { sendMessage } = useChat()
    
    const handleSend = useCallback((mess: IMessagePayload) => {
        const messageToSend: IMessage = {
            ...mess
        };
        sendMessage(messageToSend)
    }, [sendMessage])

    return (
        <div>
            <MessageBox onSend={handleSend} />
        </div>
    )
}