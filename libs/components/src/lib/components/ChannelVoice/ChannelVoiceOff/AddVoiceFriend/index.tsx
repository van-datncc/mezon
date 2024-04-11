import { useModal } from 'react-modal-hook';
import ModalInvite from '../../../ListMemberInvite/modalInvite';

export type AddVoiceFriendProps = {
	channelId: string;
};

function AddVoiceFriend({ channelId }: AddVoiceFriendProps) {
	const [openInviteChannelModal, closeInviteChannelModal] = useModal(() => (
		<ModalInvite onClose={closeInviteChannelModal} open={true} channelID={channelId} />
	));
	return (
		<div className="bg-black rounded-[10px] w-full m-auto flex justify-center items-center min-h-full overflow-hidden">
			<button className="bg-[#26262B] rounded p-2 text-lg" onClick={openInviteChannelModal}>
				Invites Friend
			</button>
		</div>
	);
}

export default AddVoiceFriend;
