import { MessagesEntity } from '@mezon/store-mobile';
import { EmojiDataOptionals, IEmoji, IMessageSendPayload, IMessageWithUser, IUserAccount } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef, ApiUser } from 'mezon-js/api.gen';
import { EMessageActionType, EMessageBSToShow } from '../enums';

export interface IReplyBottomSheet {
	message: MessagesEntity;
	onClose: () => void;
	type: EMessageBSToShow | null;
	onConfirmAction: (payload: IConfirmActionPayload) => void;
	mode?: ChannelStreamMode;
	clanId?: string;
	isOnlyEmojiPicker?: boolean;
	user?: ApiUser | null;
	senderDisplayName?: string;
	isPublic?: boolean;
}

export interface IMessageActionPayload {
	type: EMessageBSToShow;
	message?: IMessageWithUser;
	user?: ApiUser;
	senderDisplayName?: string;
}

export interface IConfirmActionPayload {
	type: EMessageActionType;
	message?: IMessageWithUser;
	user?: ApiUser;
	senderDisplayName?: string;
}

export interface IMessageAction {
	id: number;
	title: string;
	type: EMessageActionType;
}

export interface IMessageActionNeedToResolve {
	type: EMessageActionType;
	targetMessage: IMessageWithUser;
	isStillShowKeyboard?: boolean;
	replyTo?: string;
}

export interface IMessageReactionProps {
	message: IMessageWithUser;
	mode: number;
	openEmojiPicker?: () => void;
	preventAction?: boolean;
	userProfile?: IUserAccount;
}

export interface IDetailReactionBottomSheet {
	allReactionDataOnOneMessage: EmojiDataOptionals[];
	emojiSelectedId: string | null;
	userId: string | null;
	onClose: () => void;
	emojiListPNG?: IEmoji[];
	removeEmoji?: (emoji: EmojiDataOptionals) => void;
}
export interface IPayloadThreadSendMessage {
	content: IMessageSendPayload;
	mentions?: Array<ApiMessageMention>;
	attachments?: Array<ApiMessageAttachment>;
	references?: Array<ApiMessageRef>;
}
