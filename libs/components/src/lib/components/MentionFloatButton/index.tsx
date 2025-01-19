import { FloatButton } from '@mezon/ui';
import React from 'react';

type MentionFloatButton = {
	channelId: string;
	clanId: string;
	onClick: () => void;
};

export const MentionFloatButton: React.FC<MentionFloatButton> = ({ channelId, clanId, onClick }) => {
	return <FloatButton content={'New mentions'} backgroundColor={'#DA373C'} textColor={'white'} onClick={onClick} className={'uppercase'} />;
};
