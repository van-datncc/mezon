import { IMessageWithUser } from "@mezon/utils";
import { EMessageActionType, EMessageBSToShow } from "../enums";

export interface IReplyBottomSheet {
    message: IMessageWithUser;
    onClose: () => void;
    type: EMessageBSToShow | null;
    onConfirmDeleteMessage: () => void;
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
