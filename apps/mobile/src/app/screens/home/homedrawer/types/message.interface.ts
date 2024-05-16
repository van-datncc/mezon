import { IMessageWithUser } from "@mezon/utils";
import { EChatBoxAction, EMessageActionType, EMessageBSToShow } from "../enums";

export interface IReplyBottomSheet {
    message: IMessageWithUser;
    onClose: () => void;
    type: EMessageBSToShow | null;
}

export interface IMessageAction {
    id: number;
    title: string;
    icon: string;
    type: EMessageActionType;
}

export interface IMessageListNeedToResolve {
    type: EChatBoxAction,
    message: IMessageWithUser,
}
