export function transformPayloadWriteSocket({
	clanId,
	parentId,
	isPublicChannel,
	isPrivateParent,
	isClanView
}: {
	clanId: string;
	parentId: string;
	isPublicChannel: boolean;
	isPrivateParent: boolean;
	isClanView: boolean;
}) {
	const payload = {
		clan_id: clanId,
		parent_id: parentId,
		is_public: isPublicChannel,
		is_parent_public: isPrivateParent
	};

	if (!isClanView) {
		payload.clan_id = '';
		payload.parent_id = '';
		payload.is_public = false;
		payload.is_parent_public = false;
	}
	return payload;
}
