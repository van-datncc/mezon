import { selectDirectsOpenlistOrder } from '@mezon/store-mobile';
import React from 'react';
import { useSelector } from 'react-redux';
import MessagesScreenRender from './MessagesScreenRender';

const MessagesScreen = () => {
	const dmGroupChatList = useSelector(selectDirectsOpenlistOrder);

	return <MessagesScreenRender chatList={JSON.stringify(dmGroupChatList)} />;
};

export default MessagesScreen;
