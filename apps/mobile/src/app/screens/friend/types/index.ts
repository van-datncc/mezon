import { FriendsEntity } from "@mezon/store-mobile";

export interface IUserItem {
	friend: FriendsEntity;
}

export interface IFriendGroupByCharacter {
    character: string;
    friendList: FriendsEntity[];
}