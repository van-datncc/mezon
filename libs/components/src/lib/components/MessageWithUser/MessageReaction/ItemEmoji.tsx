import { useAuth, useChatReaction } from '@mezon/core';
import { selectCurrentChannel } from '@mezon/store';
import { EmojiDataOptionals, IMessageWithUser, SenderInfoOptionals, calculateTotalCount, getSrcEmoji, isPublicChannel } from '@mezon/utils';
import Tooltip from 'rc-tooltip';
import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import UserReactionPanel from './UserReactionPanel';

type EmojiItemProps = {
	emoji: EmojiDataOptionals;
	mode: number;
	message: IMessageWithUser;
};

function ItemEmoji({ emoji, mode, message }: EmojiItemProps) {
	const userId = useAuth();
	const { reactionMessageDispatch } = useChatReaction();
	const getUrlItem = getSrcEmoji(emoji.emojiId || '');
	const count = calculateTotalCount(emoji.senders);
	const userSenderCount = emoji.senders.find((sender: SenderInfoOptionals) => sender.sender_id === userId.userId)?.count;
	const currentChannel = useSelector(selectCurrentChannel);

	async function reactOnExistEmoji(
		id: string,
		mode: number,
		messageId: string,
		emojiId: string,
		emoji: string,
		count: number,
		message_sender_id: string,
		action_delete: boolean
	) {
		await reactionMessageDispatch(
			id,

			messageId ?? '',
			emojiId ?? '',
			emoji ?? '',
			1,
			message_sender_id ?? '',
			false,
			isPublicChannel(currentChannel),
			message.content?.tp ?? ''
		);
	}

	return (
		<Tooltip overlay={<UserReactionPanel message={message} emojiShowPanel={emoji} mode={mode} />} placement="top">
			<div>
				<ItemDetail
					userSenderCount={userSenderCount ?? NaN}
					onClickReactExist={() =>
						reactOnExistEmoji(
							emoji.emojiId ?? '',
							mode,
							emoji.message_id ?? '',
							emoji.emojiId ?? '',
							emoji.emoji ?? '',
							1,
							userId.userId ?? '',
							false
						)
					}
					getUrlItem={getUrlItem}
					totalCount={count}
				/>
			</div>
		</Tooltip>
	);
}

export default memo(ItemEmoji);

type ItemDetailProps = {
	userSenderCount: number;
	onClickReactExist: () => void;
	getUrlItem: string;
	totalCount: number;
};

const ItemDetail = ({ userSenderCount, onClickReactExist, getUrlItem, totalCount }: ItemDetailProps) => {
	const strCount = useMemo(() => {
		const thresh = 1000;

		if (Math.abs(totalCount) < thresh) {
			return totalCount;
		}

		const units = ['K', 'M', 'G', 'T'];
		let u = -1;
		const r = 10 ** 1;

		let num = totalCount;
		do {
			num /= thresh;
			++u;
		} while (Math.round(Math.abs(num) * r) / r >= thresh && u < units.length - 1);

		return num.toFixed(0) + units[u];
	}, [totalCount]);

	return (
		<div className="flex flex-row gap-1" style={{ height: 24 }}>
			<div
				className={`rounded-md w-fit min-w-12 gap-3 h-6 flex flex-row noselect
          cursor-pointer justify-center items-center relative
          ${userSenderCount > 0 ? 'dark:bg-[#373A54] bg-gray-200 border-blue-600 border' : 'dark:bg-[#2B2D31] bg-bgLightMode border-[#313338]'}`}
				onClick={onClickReactExist}
			>
				<span className="absolute left-[5px]">
					<img src={getUrlItem} className="w-4 h-4 object-scale-down" alt="Item Icon" />
				</span>
				<div className=" text-[13px] top-[2px] ml-5 absolute justify-center text-center cursor-pointer dark:text-white text-black">
					<p>{strCount}</p>
				</div>
			</div>
		</div>
	);
};
