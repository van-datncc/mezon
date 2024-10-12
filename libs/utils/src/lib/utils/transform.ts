export function transformPayloadWriteSocket({
	clanId,
	isPublicChannel,
	isClanView
}: {
	clanId: string;
	isPublicChannel: boolean;
	isClanView: boolean;
}) {
	const payload = {
		clan_id: clanId,
		is_public: isPublicChannel
	};

	if (!isClanView) {
		payload.clan_id = '';
		payload.is_public = false;
	}
	return payload;
}
