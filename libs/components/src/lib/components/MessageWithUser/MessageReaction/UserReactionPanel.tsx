import { Icons } from '@mezon/components';
import { useAuth, useChatReaction, useEmojiSuggestion } from '@mezon/core';
import { reactionActions, selectCurrentChannel } from '@mezon/store';
import { AvatarComponent, NameComponent } from '@mezon/ui';
import { EmojiDataOptionals, SenderInfoOptionals, calculateTotalCount, getSrcEmoji } from '@mezon/utils';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type UserReactionPanelProps = {
	emojiShowPanel: EmojiDataOptionals;
	mode: number;
};

const UserReactionPanel = ({ emojiShowPanel, mode }: UserReactionPanelProps) => {
	const currentChannel = useSelector(selectCurrentChannel);
	const dispatch = useDispatch();
	const { emojiListPNG } = useEmojiSuggestion();
	const userId = useAuth();
	const { reactionMessageDispatch } = useChatReaction();
	const removeEmojiSender = async (id: string, messageId: string, emoji: string, message_sender_id: string, countRemoved: number) => {
		await reactionMessageDispatch(
			id,
			mode,
			currentChannel?.id ?? '',
			currentChannel?.channel_label ?? '',
			messageId,
			emoji,
			countRemoved,
			message_sender_id,
			true,
		);
	};
	const [senderList, setSenderList] = useState<SenderInfoOptionals[]>(emojiShowPanel.senders);

	const hideSenderOnPanel = useCallback((emojiData: EmojiDataOptionals, senderId: string) => {
		const newEmojiData = { ...emojiData };
		if (newEmojiData.senders) {
			newEmojiData.senders = newEmojiData.senders.filter((sender) => sender.sender_id !== senderId);
		}
		setSenderList(newEmojiData.senders);
		return newEmojiData;
	}, []);

	const count = calculateTotalCount(senderList);
	const onLeavePanel = () => {
		dispatch(reactionActions.setEmojiHover(null));
		dispatch(reactionActions.setUserReactionPanelState(false));
	};

	return (
		<>
			{count > 0 && (
				<div className="flex flex-col justify-center ">
					<div
						onMouseLeave={onLeavePanel}
						onClick={(e) => e.stopPropagation()}
						className={`z-50   w-[18rem]
				dark:bg-[#28272b] bg-white border-[#28272b] rounded-sm min-h-5 max-h-[25rem] ${window.innerWidth < 640 ? 'absolute  bottom-7' : 'p-1 bottom-0'}`}
					>
						<div>
							<div className="flex flex-row items-center m-2 dark:text-white text-black">
								<img src={getSrcEmoji(emojiShowPanel.emoji ?? '', emojiListPNG)} className="w-5 h-5"></img>{' '}
								<p className="text-sm ml-2">{count}</p>
							</div>
							<hr className="h-[0.1rem] dark:bg-blue-900 bg-[#E1E1E1] border-none"></hr>
						</div>

						{senderList.map((sender: SenderInfoOptionals, index: number) => {
							if (sender.count && sender.count > 0) {
								return (
									<div key={`${index}_${sender.sender_id}`}>
										<div className="m-2 flex flex-row justify-start mb-2 items-center gap-2 relative">
											<AvatarComponent id={sender.sender_id ?? ''} />
											<NameComponent id={sender.sender_id ?? ''} />
											<p className="text-xs absolute right-8 dark:text-textDarkTheme text-textLightTheme">{sender.count}</p>
											{sender.sender_id === userId.userId && sender.count && sender.count > 0 && (
												<div
													onClick={(e: any) => {
														e.stopPropagation();
														removeEmojiSender(
															emojiShowPanel.id ?? '',
															emojiShowPanel.message_id ?? '',
															emojiShowPanel.emoji ?? '',
															sender.sender_id ?? '',
															sender.count ?? 0,
														);
														hideSenderOnPanel(emojiShowPanel, sender.sender_id ?? '');
													}}
													className="right-1 absolute cursor-pointer"
												>
													<Icons.Close defaultSize="w-3 h-3" />
												</div>
											)}
										</div>
									</div>
								);
							}
							return null;
						})}
					</div>
				</div>
			)}
		</>
	);
};

export default UserReactionPanel;
