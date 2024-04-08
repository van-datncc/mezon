import { referencesActions, selectMemberByUserId, selectOpenReplyMessageState, selectReferenceMessage } from '@mezon/store';
import { useDispatch, useSelector } from 'react-redux';
import * as Icons from '../Icons/index';

function ReplyMessageBox() {
	const dispatch = useDispatch();
	const refMessage = useSelector(selectReferenceMessage);
	const getSenderMessage = useSelector(selectMemberByUserId(refMessage?.user?.id ?? ''));
	const messageReplyState = useSelector(selectOpenReplyMessageState);

	const handleRemoveReply = () => {
		dispatch(referencesActions.setOpenReplyMessageState(false));
		dispatch(referencesActions.setReferenceMessage(null));
		dispatch(referencesActions.setDataReferences(null));
	};

	return (
		<>
			{refMessage && messageReplyState && (
				<div className="flex flex-row items-center justify-between w-full my-2  bg-[#2B2D31] p-2 rounded-md text-[14px]">
					<div className="">
						Replying to <span className=" text-[#84ADFF] font-semibold">{getSenderMessage?.user?.username}</span>
					</div>
					<button className="relative iconHover" onClick={handleRemoveReply}>
						<Icons.CircleClose />
					</button>
				</div>
			)}
		</>
	);
}

export default ReplyMessageBox;
