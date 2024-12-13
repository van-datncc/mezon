import { Block } from '@mezon/mobile-ui';
import { selectValueTopic } from '@mezon/store-mobile';
import { ChannelStreamMode } from 'mezon-js';
import React from 'react';
import { useSelector } from 'react-redux';
import MessageItem from '../../../MessageItem';

export default function TopicHeader() {
	const valueTopic = useSelector(selectValueTopic);

	return (
		<Block>
			<MessageItem message={valueTopic} messageId={valueTopic?.id} mode={ChannelStreamMode.STREAM_MODE_CHANNEL} preventAction />
		</Block>
	);
}
