export interface IMentionOnMessage {
	user_id: string | undefined;
	username: string | undefined;
	start_index?: number | undefined;
	end_index?: number | undefined;
}

export interface IHashtagOnMessage {
	channel_id: string | undefined;
	channel_lable: string | undefined;
	start_index?: number | undefined;
	end_index?: number | undefined;
}
export interface IEmojiOnMessage {
	shortname: string | undefined;
	start_index?: number | undefined;
	end_index?: number | undefined;
}
export interface ILinkOnMessage {
	link: string | undefined;
	start_index?: number | undefined;
	end_index?: number | undefined;
}
export interface ImarkdownOnMessage {
	markdown: string | undefined;
	start_index?: number | undefined;
	end_index?: number | undefined;
}
