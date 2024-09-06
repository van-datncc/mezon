import { useShowName } from '@mezon/core';
import { referencesActions, selectMessageByMessageId } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { useDispatch, useSelector } from 'react-redux';
import { useMessageParser } from '../MessageWithUser/useMessageParser';

type MessageReplyProps = {
	channelId: string;
	idMessage: string;
};

function ReplyMessageBox({ channelId, idMessage }: MessageReplyProps) {
	const dispatch = useDispatch();
	const refMessage = useSelector(selectMessageByMessageId(idMessage));

	const { userClanNickname, userDisplayName, username, senderId } = useMessageParser(refMessage);

	const nameShowed = useShowName(userClanNickname ?? '', userDisplayName ?? '', username ?? '', senderId ?? '');

	const handleRemoveReply = () => {
		dispatch(referencesActions.setIdReferenceMessageReply({ channelId, idMessageRefReply: '' }));
		dispatch(
			referencesActions.setDataReferences({
				channelId: channelId,
				dataReferences: { has_attachment: false, channel_id: '', mode: 0, channel_label: '' }
			})
		);
	};

	return (
		<div className="flex flex-row items-center justify-between w-full my-2 dark:bg-[#2B2D31] bg-bgLightMode p-2 rounded-md text-[14px]">
			<div className="dark:text-white text-black">
				Replying to <span className=" dark:text-[#84ADFF] text-[#3297ff] font-semibold">{nameShowed}</span>
			</div>
			<button className="relative" onClick={handleRemoveReply}>
				<Icons.CircleClose />
			</button>
		</div>
	);
}

export default ReplyMessageBox;
