import { IMessageWithUser, TIME_COMBINE, checkSameDay, convertTimeHour, convertTimeString, getTimeDifferenceInSeconds } from "@mezon/utils";
import { useMemo } from "react";
import { ApiMessageAttachment, ApiMessageMention } from "vendors/mezon-js/packages/mezon-js/dist/api.gen";

export type IParsedMessage = {
    content: string;
    messageTime: string;
    messageHour: string;
    attachments?: ApiMessageAttachment[] | null;
    mentions?: ApiMessageMention[] | null;
    lines: string[]
    isSameDay: boolean;
    isCombine: boolean;
}

export function useMessageParser( message: IMessageWithUser, preMessage?: IMessageWithUser): IParsedMessage {
    const attachments = useMemo(() => {
		return message.attachments || null;
	}, [message])

    const mentions = useMemo(() => {
		return message.mentions || null;
	}, [message])

	const content = useMemo(() => {
		return message.content;
	}, [message]);

    const lines =   useMemo(() => {
        const values = content.t?.split('\n') || [];
		return values
	}, [content]);    

    const messageTime = useMemo(() => {
        return convertTimeString(message?.create_time as string)
    }, [message])

    const messageHour = useMemo(() => {
        return convertTimeHour(message?.create_time || '' as string)
    }, [message])

    const isSameDay =  useMemo(() => {
        return checkSameDay(preMessage?.create_time as string, message?.create_time as string)
    }, [message, preMessage])

    	// TODO: optimize more
	const isCombine = useMemo(() => {
		const timeDiff = getTimeDifferenceInSeconds(preMessage?.create_time as string, message?.create_time as string);
		return (
			timeDiff < TIME_COMBINE &&
			preMessage?.user?.id === message?.user?.id &&
			checkSameDay(preMessage?.create_time as string, message?.create_time as string)
		);
	}, [message, preMessage]);

    return {
        content,
        messageTime,
        messageHour,
        attachments,
        mentions,
        lines,
        isSameDay,
        isCombine
    }
}