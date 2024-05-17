import { Button, Label, Modal } from 'flowbite-react';

type ModalRemoveMemberClanProps = {
	openModal: boolean;
	username?: string;
	onClose: () => void;
};

const ModalRemoveMemberClan = ({ openModal, username, onClose }: ModalRemoveMemberClanProps) => {
	return (
		<Modal theme={{ content: { base: 'w-[440px]' } }} show={openModal} dismissible={true} onClose={onClose}>
			<div className="bg-bgPrimary pt-4 rounded">
				<div className="px-4">
					<h1 className="text-white text-xl font-semibold">{`Kick ${username} from Server`}</h1>
				</div>
				<form className="flex w-full flex-col gap-5 pt-4">
					<div className="px-4">
						<div className="block">
							<p className="text-[#B5BAC1] text-base font-medium">{`Are you sure you want to kick @${username} from the server? They will be able to rejoin again with a new invite.`}</p>
						</div>
					</div>
					<div className="px-4">
						<div className="mb-2 block">
							<Label value="Reason for Kick" className="text-[#B5BAC1] text-xs uppercase font-semibold" />
						</div>
						<textarea
							rows={2}
							className="text-[#B5BAC1] outline-none w-full h-16 p-[10px] bg-[#26262B] text-base rounded placeholder:text-sm"
							placeholder="Support has arrived!"
						/>
					</div>

					<div className="flex justify-end p-4 rounded-b bg-[#2B2D31]">
						<Button
							className="h-10 px-4 rounded bg-transparent dark:bg-transparent hover:!bg-transparent hover:!underline focus:!ring-transparent"
							type="button"
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							className="h-10 px-4 rounded bg-colorDanger hover:!bg-colorDangerHover dark:bg-colorDanger dark:hover:!bg-colorDangerHover focus:!ring-transparent"
							type="submit"
						>
							Save
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default ModalRemoveMemberClan;
