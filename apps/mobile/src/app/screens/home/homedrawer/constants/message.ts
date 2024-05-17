import { TFunction } from "i18next";
import { IMessageAction } from "../types";
import { EMessageActionType } from "../enums";

export const getMessageActions = (t: TFunction): IMessageAction[] => {
    return [
        {
            id: 1,
            title: t('message:actions.editMessage'),
            icon: 'pen-tool',
            type: EMessageActionType.EditMessage
        },
        {
            id: 2,
            title: t('message:actions.reply'),
            icon: 'arrow-right-circle',
            type: EMessageActionType.Reply
        },
        {
            id: 3,
            title: t('message:actions.createThread'),
            icon: 'edit',
            type: EMessageActionType.CreateThread
        },
        {
            id: 4,
            title: t('message:actions.copyText'),
            icon: 'edit',
            type: EMessageActionType.CopyText
        },
        {
            id: 5,
            title: t('message:actions.deleteMessage'),
            icon: 'delete',
            type: EMessageActionType.EditMessage
        },
        {
            id: 6,
            title: t('message:actions.pinMessage'),
            icon: 'map-pin',
            type: EMessageActionType.PinMessage
        },
        {
            id: 7,
            title: t('message:actions.markUnRead'),
            icon: 'edit',
            type: EMessageActionType.MarkUnRead
        },
        {
            id: 8,
            title: t('message:actions.mention'),
            icon: 'bell-off',
            type: EMessageActionType.Mention
        },
        {
            id: 9,
            title: t('message:actions.copyMessageLink'),
            icon: 'coffee',
            type: EMessageActionType.CopyMessageLink
        }
    ];
}
