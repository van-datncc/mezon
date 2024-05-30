import { GifStickerEmojiPopup, ShortUserProfile } from '@mezon/components';
import { useApp, useChatReaction, useGifsStickersEmoji, useMenu, useReference, useThreads } from '@mezon/core';
import { selectCurrentChannel, selectReactionRightState, selectReactionTopState } from '@mezon/store';
import { EmojiPlaces, SubPanelName } from '@mezon/utils';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const ChannelLayout = () => {
	const reactionRightState = useSelector(selectReactionRightState);
	const currentChannel = useSelector(selectCurrentChannel);
	const reactionTopState = useSelector(selectReactionTopState);
	const { idMessageRefReaction } = useReference();
	const { reactionBottomState } = useChatReaction();
	const { userIdShowProfile, positionOfMention } = useReference();
	const profileRef = useRef<HTMLDivElement>(null);

	const { subPanelActive } = useGifsStickersEmoji();
	const { closeMenu, statusMenu } = useMenu();
	const { isShowCreateThread } = useThreads();
	const { isShowMemberList } = useApp();
	const { positionOfSmileButton } = useChatReaction();

	const HEIGHT_EMOJI_PANEL: number = 457;
	const WIDTH_EMOJI_PANEL: number = 500;

	const distanceToBottom = window.innerHeight - positionOfSmileButton.bottom;
	const distanceToRight = window.innerWidth - positionOfSmileButton.right;
	let topPositionEmojiPanel: string;

	if (distanceToBottom < HEIGHT_EMOJI_PANEL) {
		topPositionEmojiPanel = 'auto';
	} else if (positionOfSmileButton.top < 100) {
		topPositionEmojiPanel = `${positionOfSmileButton.top}px`;
	} else {
		topPositionEmojiPanel = `${positionOfSmileButton.top - 100}px`;
	}

	const WIDTH_PROFILE_POPUP = profileRef.current?.clientWidth;
	const HEIGHT_PROFILE_POPUP = profileRef.current?.clientHeight;
	const distanceToBottomProfileRef = window.innerHeight - positionOfMention.bottom;
	const distanceToRightProfileRef = window.innerWidth - positionOfMention.right;

	let topPositionProfileDiv: string;

	if (HEIGHT_PROFILE_POPUP && distanceToBottomProfileRef < HEIGHT_PROFILE_POPUP) {
		topPositionProfileDiv = 'auto';
	} else if (positionOfMention.top < 100) {
		topPositionProfileDiv = `${positionOfMention.top}px`;
	} else {
		topPositionProfileDiv = `${positionOfMention.top - 100}px`;
	}

	return (
		<div
			className={`flex flex-col flex-1 shrink min-w-0 bg-transparent h-[100%] overflow-visible ${currentChannel?.type === ChannelType.CHANNEL_TYPE_VOICE ? 'group' : ''}`}
		>
			<div className="flex h-heightWithoutTopBar flex-row">
				<Outlet />
			</div>
			{subPanelActive === SubPanelName.EMOJI_REACTION_RIGHT && (
				<div
					id="emojiPicker"
					className={`fixed size-[500px] max-sm:hidden right-1 ${closeMenu && !statusMenu && 'w-[370px]'} ${reactionTopState ? 'top-20' : 'bottom-20'} ${isShowCreateThread && 'ssm:right-[650px]'} ${isShowMemberList && 'ssm:right-[420px]'} ${!isShowCreateThread && !isShowMemberList && 'ssm:right-44'}`}
				>
					<div className="mb-0 z-10 h-full">
						<GifStickerEmojiPopup
							messageEmojiId={idMessageRefReaction}
							mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
							emojiAction={EmojiPlaces.EMOJI_REACTION}
						/>
					</div>
				</div>
			)}
			{subPanelActive === SubPanelName.EMOJI_REACTION_BOTTOM && (
				<div
					className="fixed max-sm:hidden"
					style={{
						top: topPositionEmojiPanel,
						bottom: distanceToBottom < HEIGHT_EMOJI_PANEL ? '0' : 'auto',
						left:
							distanceToRight < WIDTH_EMOJI_PANEL
								? `${positionOfSmileButton.left - WIDTH_EMOJI_PANEL}px`
								: `${positionOfSmileButton.right}px`,
					}}
				>
					<div className="mb-0 z-10 h-full">
						<GifStickerEmojiPopup
							messageEmojiId={idMessageRefReaction}
							mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
							emojiAction={EmojiPlaces.EMOJI_REACTION}
						/>
					</div>
				</div>
			)}
			{userIdShowProfile !== '' && (
				<div
					className="fixed max-sm:hidden"
					style={{
						top: topPositionProfileDiv,
						bottom: HEIGHT_PROFILE_POPUP && distanceToBottomProfileRef < HEIGHT_PROFILE_POPUP ? '0' : 'auto',
						left:
							WIDTH_PROFILE_POPUP && distanceToRightProfileRef < WIDTH_PROFILE_POPUP
								? `${positionOfMention.left - WIDTH_PROFILE_POPUP}px`
								: `${positionOfMention.right}px`,
					}}
				>
					<div ref={profileRef} className="dark:bg-black bg-gray-200 mt-[10px] w-[360px] rounded-lg flex flex-col z-10 fixed opacity-100">
						<ShortUserProfile userID={userIdShowProfile} />
					</div>
				</div>
			)}
		</div>
	);
};

export default ChannelLayout;
