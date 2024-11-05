import { MessagesEntity } from '@mezon/store-mobile';
import React from 'react';
import RenderMessageInvite from './components/RenderMessageInvite';
import RenderMessageMapView from './components/RenderMessageMapView/RenderMessageMapView';
function RenderMessageBlock({
	isInviteLink,
	isGoogleMapsLink,
	message
}: {
	message: MessagesEntity;
	isGoogleMapsLink: boolean;
	isInviteLink: boolean;
}) {
	const { t: contentMessage } = message?.content || {};
	if (isInviteLink) return <RenderMessageInvite content={contentMessage} />;
	if (isGoogleMapsLink) return <RenderMessageMapView content={contentMessage} />;
	return null;
}

export default React.memo(RenderMessageBlock);
