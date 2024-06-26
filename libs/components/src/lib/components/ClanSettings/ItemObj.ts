export type ItemObjProps = {
	id: string;
	name: string;
};

export const ItemSetting = {
	OVERVIEW: 'overview',
	ROLES: 'roles',
	EMOJI: 'emoji',
	STICKERS: 'Stickers',
	DELETE_SERVER: 'delete_server',
	INTEGRATIONS: "integrations",
};

export const listItemSetting: ItemObjProps[] = [
	{ id: ItemSetting.OVERVIEW, name: 'Overview' },
	{ id: ItemSetting.ROLES, name: 'Roles' },
	{ id: ItemSetting.EMOJI, name: 'Emoji' },
	{ id: ItemSetting.STICKERS, name: 'Stickers' },
	{ id: ItemSetting.INTEGRATIONS, name: 'Integrations' },
];
