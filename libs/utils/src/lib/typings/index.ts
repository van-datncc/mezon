import {
  ApiCategoryDesc,
  ApiChannelDescription,
  ChannelUserListChannelUser,
  ApiClanDesc,
  ApiUser,
  ApiAccount,
  
} from '@mezon/mezon-js/dist/api.gen';
import { ChannelMessage } from '@mezon/mezon-js';

 

export type LoadingStatus = 'not loaded' | 'loading' | 'loaded' | 'error';

export type IClan = ApiClanDesc & {
  id: string;
};
export type ICategory = ApiCategoryDesc & {
  id: string;
};

export type ICategoryChannel = ICategory & {
  channels: IChannel[];
};

export type IRole = {
  role_id: string;
};

export type IRoleUsers = IRole & {
  users: ApiUser[];
};

export type IChannel = ApiChannelDescription & {
  id: string;
  unread?: boolean;
  description?: string;
};

export type IChannelMember = ChannelUserListChannelUser & {
  id: string;
};

export type IThread = {
  name: string | undefined;
  id: string | undefined;
  clanId: string | undefined;
  channelId: string | undefined;
  content: string | undefined;
  date: string | undefined;
};

export type IContextMenuItemAction = 'REST';

export type IContextMenuItemMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type IContextMenuItemPayload = {
  // any
};

export type IContextMenuItemCallback = {
  // any
};

export type IContextMenuItem = {
  label: string;
  icon?: string;
  action: IContextMenuItemAction;
  method: IContextMenuItemMethod;
  payload: IContextMenuItemPayload;
};

export type IMessageContextMenu = {
  items: IContextMenuItem[];
};

export type IMessageMeta = {
  contextMenu: IMessageContextMenu;
};

export type IMessage = ChannelMessage & {
  id: string;
  body: {
    text: string;
  };
  content?: {
    content?: string | undefined;
  };
  date?: string | undefined;
  creationTime?: Date;
  creationTimeMs?: number;
};

export type IMessageWithUser = IMessage & {
  user: IUser | null;
};

export type IUser = {
  name: string;
  username: string;
  id: string;
  avatarSm: string;
};

export interface CategoryNameProps {
  ChannelType: string | undefined;
  channelStatus: string | undefined;
  name: string | undefined;
}

export interface ThreadNameProps {
  name: string | undefined;
}

export interface IconProps {
  url: string;
}

export type ChannelListProps = { className?: string };

export enum ChannelStatus {
  OPEN = 'open',
  CLOSE = 'close',
}

export enum channelStatusEnum {
  LOCK = 'lock',
  UNLOCK = 'unlock',
}

export interface CategoryProps {
  name: string | undefined;
  status?: string | undefined;
  type?: string | undefined;
}

export interface ThreadProps {
  name: string;
}

export type IUserAccount = ApiAccount;

export enum ChannelStatusEnum {
  LOCK = 'lock',
  UNLOCK = 'unlock',
}

export enum ChannelTypeEnum {
  CHANNEL_TEXT = 1,
  CHANNEL_VOICE = 4,
  FORUM = 2,
  ANNOUNCEMENT = 3,
}

export interface ChannelProps {
  name?: string;
  status?: ChannelStatusEnum;
  categories?: Record<string, CategoryProps>;
  type: ChannelTypeEnum;
}

export interface CategoryProps {
  name: string | undefined;
  status?: string | undefined;
  type?: string | undefined;
}

export interface ThreadProps {
  name: string;
}

