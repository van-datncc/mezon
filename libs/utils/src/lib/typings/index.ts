export type IClan = {
    name: string;
    id: string;
    image: string;
    description: string;
    memberIds: string[];
    channelIds: string[];
    categoryIds?: string[];
    categories?: ICategory[];
}

export type ICategory = {
    name: string;
    id: string;
    clanId: string;
    channelIds: string[];
    channels?: IChannel[];
}

export type IChannel = {
    name: string;
    id: string;
    clanId: string;
    categoryId: string;
    memberIds: string[];
    description?: string;
    threadIds: string[];
    unread: boolean
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

export type IMessage = {
    name: string;
    id: string;
    clanId: string;
    channelId: string;
    content: string;
    date: string;
    user?: IUser;
    isMe?: boolean;
}

export type IUser = {
    name: string;
    username: string;
    id: string;
    avatarSm: string;
}

