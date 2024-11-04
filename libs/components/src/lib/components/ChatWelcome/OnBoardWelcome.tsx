import { useMessageValue } from '@mezon/core';
import { channelsActions, selectAllChannels, selectMembersClanCount, useAppSelector } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { ReactNode, useEffect } from 'react';
import { useModal } from 'react-modal-hook';
import { useDispatch } from 'react-redux';
import ModalInvite from '../ListMemberInvite/modalInvite';
export type OnBoardWelcomeProps = {
	nextMessageId?: string;
};

function OnBoardWelcome({ nextMessageId }: OnBoardWelcomeProps) {
	const numberMemberClan = useAppSelector(selectMembersClanCount);
	const numberChannel = useAppSelector(selectAllChannels);

	const { setRequestInput } = useMessageValue();
	const dispatch = useDispatch();
	const [openInviteClanModal, closeInviteClanModal] = useModal(() => <ModalInvite onClose={closeInviteClanModal} open={true} />);

	const driverObj = driver();

	const handleSendMessage = () => {
		if (!nextMessageId) {
			setRequestInput({ content: 'Enter to send first Message', mentionRaw: [], valueTextInput: 'Enter to send first Message' });
			const inputReact = document.getElementById('editorReactMention');
			if (inputReact) {
				driverObj.highlight({
					element: inputReact,
					popover: {
						side: 'top',
						description: 'Enter to send message !!'
					}
				});
				inputReact?.focus();
			}
		}
	};

	const handleCreateChannel = () => {
		if (numberChannel.length < 1) {
			return;
		}
		dispatch(channelsActions.openCreateNewModalChannel(true));
	};

	useEffect(() => {
		if (nextMessageId) {
			driverObj.destroy();
		}
	}, [nextMessageId]);

	return (
		<div className="w-full px-4 mb-0  flex-1 flex flex-col items-center gap-2">
			<Onboarditem icon={<Icons.AddPerson />} title="Invite your friends" tick={numberMemberClan > 1} onClick={openInviteClanModal} />
			<Onboarditem icon={<Icons.Sent />} title="Send your first message" tick={!!nextMessageId} onClick={handleSendMessage} />
			<Onboarditem icon={<Icons.Download />} title="Download the Mezon App" tick={true} onClick={handleSendMessage} />
			<Onboarditem icon={<Icons.Hashtag />} title="Create your channel" tick={numberChannel.length > 1} onClick={handleCreateChannel} />
		</div>
	);
}

const Onboarditem = ({ icon, title, tick, onClick }: { icon: ReactNode; title: string; tick: boolean; onClick: () => void }) => {
	const handleOnClickItem = () => {
		if (tick) {
			onClick();
		}
	};
	return (
		<div
			className="w-[400px] gap-4 h-[72px] items-center flex p-4 text-sm font-semibold bg-[#232428] hover:bg-[#393c41] rounded-lg"
			onClick={handleOnClickItem}
		>
			{icon}
			<div className="flex-1">{title}</div>
			{tick ? (
				<div className="flex items-center justify-center rounded-full aspect-square h-8 bg-green-600">
					<Icons.Tick fill="white" />
				</div>
			) : (
				<Icons.ArrowRight />
			)}
		</div>
	);
};

export default OnBoardWelcome;
