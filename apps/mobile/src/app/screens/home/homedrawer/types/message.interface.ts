import { EmojiDataOptionals, IMessageWithUser } from "@mezon/utils";
import { EMessageActionType, EMessageBSToShow } from "../enums";

export interface IReplyBottomSheet {
    message: IMessageWithUser;
    onClose: () => void;
    type: EMessageBSToShow | null;
    onConfirmDeleteMessage: () => void;
    mode?: number;
}

export interface IMessageAction {
    id: number;
    title: string;
    type: EMessageActionType;
}

export interface IMessageActionNeedToResolve {
    type: EMessageActionType,
    targetMessage: IMessageWithUser,
}

export interface IMessageReactionProps {
	message: IMessageWithUser;
	mode: number;
    dataReactionCombine?: EmojiDataOptionals[]
}

export interface IDetailReactionBottomSheet {
    allReactionDataOnOneMessage: EmojiDataOptionals[];
    emojiSelectedId: string | null;
    onClose: () => void;
}