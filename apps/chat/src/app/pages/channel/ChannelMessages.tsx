import { ChatWelcome, GifStickerEmojiPopup } from '@mezon/components';
import { ChatContext, useAuth, useChatMessages } from '@mezon/core';
import { TabNamePopup } from '@mezon/utils';
import { useContext, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ChannelMessage } from './ChannelMessage';

type ChannelMessagesProps = {
	channelId: string;
	type: string;
	channelLabel?: string;
	avatarDM?: string;
	mode: number;
};

export default function ChannelMessages({ channelId, channelLabel, type, avatarDM, mode }: ChannelMessagesProps) {
	const { messages, unreadMessageId, lastMessageId, hasMoreMessage, loadMoreMessage } = useChatMessages({ channelId });
	const { userProfile } = useAuth();
	const containerRef = useRef<HTMLDivElement>(null);
	const { heightEditor } = useContext(ChatContext);


	const fetchData = () => {
		loadMoreMessage();
	};

	const goBottom = () => {
		if (containerRef.current !== null) {
			containerRef.current.scrollTo({ top: 10, behavior: 'smooth' });
		}
	};

	useEffect(() => {
		if (messages.length > 0 && messages[0].user?.id === userProfile?.user?.id) {
			goBottom();
		}
	}, [messages[0]]);

	const { activeTab, setActiveTab, setIsOpenEmojiMessBox, setIsOpenEmojiReacted, setIsOpenEmojiReactedBottom } = useContext(ChatContext);

	const [popupClass, setPopupClass] = useState('fixed right-[1rem] z-10');

	useEffect(() => {
		setPopupClass(`fixed right-[1rem] bottom-[${heightEditor + 20}px] z-10`);
	}, [heightEditor]);


	return (
		<div
			onClick={(e) => {
				e.stopPropagation();
				setActiveTab(TabNamePopup.NONE);
				setIsOpenEmojiMessBox(false);
				setIsOpenEmojiReacted(false);
				setIsOpenEmojiReactedBottom(false);
			}}
			className=" relative"
			id="scrollLoading"
			ref={containerRef}
			style={{
				height: '100%',
				overflowY: 'scroll',
				display: 'flex',
				flexDirection: 'column-reverse',
				overflowX: 'hidden',
			}}
		>
			<InfiniteScroll
				dataLength={messages.length}
				next={fetchData}
				style={{ display: 'flex', flexDirection: 'column-reverse', overflowX: 'hidden' }}
				inverse={true}
				hasMore={hasMoreMessage}
				loader={<h4 className="h-[50px] py-[18px] text-center">Loading...</h4>}
				scrollableTarget="scrollLoading"
				refreshFunction={fetchData}
				endMessage={<ChatWelcome type={type} name={channelLabel} avatarDM={avatarDM} />}
				pullDownToRefresh={containerRef.current !== null && containerRef.current.scrollHeight > containerRef.current.clientHeight}
				pullDownToRefreshThreshold={50}
			>
				{messages.map((message, i) => (
					<ChannelMessage
						mode={mode}
						key={message.id}
						lastSeen={message.id === unreadMessageId && message.id !== lastMessageId}
						message={message}
						preMessage={i < messages.length - 1 ? messages[i + 1] : undefined}
						myUser={userProfile?.user?.id}
						channelId={channelId}
						channelLabel={channelLabel || ''}
					/>
				))}
			</InfiniteScroll>
			{activeTab !== TabNamePopup.NONE && (
				<div
					className={popupClass}
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<GifStickerEmojiPopup />
				</div>
			)}
		</div>
	);
}

ChannelMessages.Skeleton = () => {
	return (
		<>
			<ChannelMessage.Skeleton />
			<ChannelMessage.Skeleton />
			<ChannelMessage.Skeleton />
		</>
	);
};
