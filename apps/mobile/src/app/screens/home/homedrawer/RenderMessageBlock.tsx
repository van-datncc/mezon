import React from 'react';
import RenderMessageMapView from '../../../components/RenderMessageMapView';
import RenderMessageInvite from './components/RenderMessageInvite';

function RenderMessageBlock({
	isInviteLink,
	isGoogleMapsLink,
	contentMessage,
	avatarUrl,
	isSelf,
	senderName
}: {
	isGoogleMapsLink: boolean;
	isInviteLink: boolean;
	contentMessage: string;
	avatarUrl?: string;
	isSelf?: boolean;
	senderName?: string;
}) {
	if (isInviteLink) return <RenderMessageInvite content={contentMessage} />;
	if (isGoogleMapsLink)
		return <RenderMessageMapView content={contentMessage} avatarUrl={avatarUrl} isSelf={isSelf} senderName={senderName} />;
	return null;
}

export default React.memo(RenderMessageBlock);
