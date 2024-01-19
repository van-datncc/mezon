import {ApiCategoryDesc, ApiChannelDescription, ApiClanDesc } from '@heroiclabs/nakama-js/dist/api.gen'
import {ChannelMessage} from '@heroiclabs/nakama-js'

export type IClan = ApiClanDesc & {
    id: string
}
export type ICategory = ApiCategoryDesc &{
    id: string;
}

export type ICategoryChannel = ICategory & {
    channels: IChannel[]
}

export type IChannel = ApiChannelDescription & {
    id: string;
    unread?: boolean;
    description?: string
}

export type IThread = {
    name: string;
    id: string;
    clanId: string;
    channelId: string;
    content: string;
    date: string;
}

export type IContextMenuItemAction = 'REST';

export type IContextMenuItemMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type IContextMenuItemPayload = {
    // any
}

export type IContextMenuItemCallback = {
    // any
}

export type IContextMenuItem = {
    label: string;
    icon?: string;
    action: IContextMenuItemAction;
    method: IContextMenuItemMethod;
    payload: IContextMenuItemPayload;
}

export type IMessageContextMenu = {
    items: IContextMenuItem[];
}

export type IMessageMeta = {
    contextMenu: IMessageContextMenu
}

export type IMessage = ChannelMessage & {
    id: string;
    body: {
        text: string
    }
}

export type IMessageWithUser = IMessage & {
    user: IUser | null;
}

export type IUser = {
    name: string;
    username: string;
    id: string;
    avatarSm: string;
}

