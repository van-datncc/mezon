import { ChannelMessageOpt } from '@mezon/components';
import {
    selectCurrentChannel, selectIdMessageRefOption, selectReactionPlaceActive
} from '@mezon/store';
import { EmojiPlaces, IMessageWithUser } from '@mezon/utils';
import { memo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import ChannelMessagePopupOption from './ChannelMessagePopupOption';

type PopupMessageProps = {
	reactionRightState: boolean;
	mess: IMessageWithUser;
	reactionBottomState: boolean;
	openEditMessageState: boolean;
	openOptionMessageState: boolean;
	mode: number;
	isCombine?: boolean;
	deleteSendMessage: (messageId: string) => Promise<void> | void;
};



function PopupMessage({
	reactionRightState,
	mess,
	reactionBottomState,
	openEditMessageState,
	openOptionMessageState,
	deleteSendMessage,
}: PopupMessageProps) {
	const currentChannel = useSelector(selectCurrentChannel);
	const idMessageRefOpt = useSelector(selectIdMessageRefOption);
	const reactionPlaceActive = useSelector(selectReactionPlaceActive);

	const channelMessageOptRef = useRef<HTMLDivElement>(null);
	const getDivHeightToTop = () => {
		const channelMessageDiv = channelMessageOptRef.current;
		if (channelMessageDiv) {
			channelMessageDiv.getBoundingClientRect();
		}
		return 0;
	};

	useEffect(() => {
		if (reactionRightState && idMessageRefOpt === mess.id) {
			getDivHeightToTop();
		}
	}, [idMessageRefOpt, mess.id, reactionRightState]);

	return reactionPlaceActive !== EmojiPlaces.EMOJI_REACTION_BOTTOM ? (
		<div
			className={`chooseForText z-[1] absolute h-8 p-0.5 rounded block -top-4 right-5 ${Number(currentChannel?.parrent_id) === 0 ? 'w-32' : 'w-24'}
				${(reactionRightState && mess.id === idMessageRefOpt) ||
					(reactionBottomState && mess.id === idMessageRefOpt) ||
					(openEditMessageState && mess.id === idMessageRefOpt) ||
					(openOptionMessageState && mess.id === idMessageRefOpt)
					? ''
					: 'hidden group-hover:block'
				} `}
		>
			<div className="relative">
				<ChannelMessageOpt message={mess} ref={channelMessageOptRef} />
			</div>

			{openOptionMessageState && mess.id === idMessageRefOpt && <ChannelMessagePopupOption message={mess} deleteSendMessage={deleteSendMessage} />}
		</div>
	) : null;
}

export default memo(PopupMessage);