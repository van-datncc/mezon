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

export type IMessage = {
    name: string;
    id: string;
    clanId: string;
    channelId: string;
    content: string;
    date: string;
    user?: IUser;
}

export type IUser = {
    name: string;
    username: string;
    id: string;
    avatarSm: string;
}

