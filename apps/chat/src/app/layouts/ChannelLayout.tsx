import { EmojiPickerComp } from '@mezon/components';
import { useApp, useMenu, useReference, useThreads } from '@mezon/core';
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

	const { closeMenu, statusMenu } = useMenu();
	const { isShowCreateThread } = useThreads();
	const { isShowMemberList } = useApp();

	return (
		<div
			className={`flex flex-col flex-1 shrink min-w-0 bg-bgSecondary h-[100%] overflow-visible ${currentChannel?.type === ChannelType.CHANNEL_TYPE_VOICE ? 'group' : ''}`}
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
						<EmojiPickerComp
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
