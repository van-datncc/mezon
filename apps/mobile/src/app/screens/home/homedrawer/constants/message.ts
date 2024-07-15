import { TFunction } from "i18next";
import { EMessageActionType } from "../enums";
import { IMessageAction } from "../types";

export const getMessageActions = (t: TFunction): IMessageAction[] => {
    return [
		{
			id: 12,
			title: t('message:actions.forward'),
			type: EMessageActionType.ForwardMessage,
		},
		{
			id: 1,
			title: t('message:actions.editMessage'),
			type: EMessageActionType.EditMessage,
		},
		{
			id: 2,
			title: t('message:actions.reply'),
			type: EMessageActionType.Reply,
		},
		{
			id: 3,
			title: t('message:actions.createThread'),
			type: EMessageActionType.CreateThread,
		},
		{
			id: 4,
			title: t('message:actions.copyText'),
			type: EMessageActionType.CopyText,
		},
		{
			id: 5,
			title: t('message:actions.deleteMessage'),
			type: EMessageActionType.DeleteMessage,
		},
		{
			id: 6,
			title: t('message:actions.pinMessage'),
			type: EMessageActionType.PinMessage,
		},
		{
			id: 7,
			title: t('message:actions.unPinMessage'),
			type: EMessageActionType.UnPinMessage,
		},
		{
			id: 8,
			title: t('message:actions.markUnRead'),
			type: EMessageActionType.MarkUnRead,
		},
		{
			id: 9,
			title: t('message:actions.mention'),
			type: EMessageActionType.Mention,
		},
		{
			id: 10,
			title: t('message:actions.copyMessageLink'),
			type: EMessageActionType.CopyMessageLink,
		},
		{
			id: 11,
			title: t('message:actions.report'),
			type: EMessageActionType.Report,
		},
		{
			id: 12,
			title: t('message:actions.saveImage'),
			type: EMessageActionType.SaveImage,
		},
		{
			id: 13,
			title: t('message:actions.copyMediaLink'),
			type: EMessageActionType.CopyMediaLink,
		},
	];
}

