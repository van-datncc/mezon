import { GifStickerEmojiPopup } from '@mezon/components';
import { useApp, useChatReaction, useMenu, useReference, useThreads } from '@mezon/core';
import { selectCurrentChannel, selectReactionRightState, selectReactionTopState } from '@mezon/store';
import { EmojiPlaces, IMessageWithUser } from '@mezon/utils';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const ChannelLayout = () => {
	const reactionRightState = useSelector(selectReactionRightState);
	const currentChannel = useSelector(selectCurrentChannel);
	const reactionTopState = useSelector(selectReactionTopState);
	const { referenceMessage } = useReference();
	const { reactionBottomState } = useChatReaction();

	const { closeMenu, statusMenu } = useMenu();
	const { isShowCreateThread } = useThreads();
	const { isShowMemberList } = useApp();
	const { messageMatchWithRefStatus, positionOfSmileButton } = useChatReaction();

	const HEIGHT_EMOJI_PANEL: number = 457;
	const WIDTH_EMOJI_PANEL: number = 500;
	// const [emojiTopDist, setEmojiTopDist] = useState<number>();
	// const [emojiBottomDist, setEmojiBottomDist] = useState<number>();
	// const [emojiRightDist, setEmojiRightDist] = useState();

	// useEffect(() => {
	// 	if (positionOfSmileButton.bottom < HEIGHT_EMOJI_PANEL) {
	// 		setEmojiBottomDist(emojiBottomDist);
	// 	}
	// }, [positionOfSmileButton]);

	return (
		<div
			className={`flex flex-col flex-1 shrink min-w-0 dark:bg-bgSecondary bg-bgLightModeSecond h-[100%] overflow-visible ${currentChannel?.type === ChannelType.CHANNEL_TYPE_VOICE ? 'group' : ''}`}
		>
			<div className="flex h-heightWithoutTopBar flex-row">
				<Outlet />
			</div>
			{reactionRightState && (
				<div
					id="emojiPicker"
					className={`fixed size-[500px] right-1 ${closeMenu && !statusMenu && 'w-[370px]'} ${reactionTopState ? 'top-20' : 'bottom-20'} ${isShowCreateThread && 'ssm:right-[650px]'} ${isShowMemberList && 'ssm:right-[420px]'} ${!isShowCreateThread && !isShowMemberList && 'ssm:right-44'}`}
				>
					<div className="mb-0 z-10 h-full">
						<GifStickerEmojiPopup
							messageEmoji={referenceMessage as IMessageWithUser}
							mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
							emojiAction={EmojiPlaces.EMOJI_REACTION}
						/>
					</div>
				</div>
			)}
			{reactionBottomState && messageMatchWithRefStatus && (
				<div
					className="fixed"
					style={{
						top: positionOfSmileButton.bottom < HEIGHT_EMOJI_PANEL ? 'auto' : `${positionOfSmileButton.top}px`,
						bottom: positionOfSmileButton.bottom < HEIGHT_EMOJI_PANEL ? `0` : 'auto',
						left: `${positionOfSmileButton.right}px`,
					}}
				>
					<div className="mb-0 z-10 h-full">
						<GifStickerEmojiPopup
							messageEmoji={referenceMessage as IMessageWithUser}
							mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
							emojiAction={EmojiPlaces.EMOJI_REACTION}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default ChannelLayout;
