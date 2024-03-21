import { IChannel } from '@mezon/utils';
import { useState } from 'react';
import ChannelSettingItem from './channelSettingItem';
import { DeleteModal } from './deleteChannelModal';
import ExitSetting from './exitSetting';
import IntegrationsChannel from './integrationsChannel';
import InvitesChannel from './invitesChannel';
import OverviewChannel from './overviewChannel';
import PermissionsChannel from './permissionsChannel';

export type ModalSettingProps = {
	open: boolean;
	onClose: () => void;
	channel: IChannel;
};

const SettingChannel = (props: ModalSettingProps) => {
	const { open, onClose, channel } = props;
	const [showModal, setShowModal] = useState(false);
	const [currentSetting, setCurrentSetting] = useState<string>('Overview');
	const handleSettingItemClick = (settingName: string) => {
		setCurrentSetting(settingName);
	};

	const openModal = () => {
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		onClose();
	};

	return (
		<div>
			{open ? (
				<div className="  flex fixed inset-0  w-screen z-10">
					<div className="flex text-gray- w-screen relative">
						<ChannelSettingItem onItemClick={handleSettingItemClick} channel={channel} openModal={openModal} />
						{currentSetting === 'Overview' && <OverviewChannel channel={channel} />}
						{currentSetting === 'Permissions' && <PermissionsChannel channel={channel} />}
						{currentSetting === 'Invites' && <InvitesChannel />}
						{currentSetting === 'Integrations' && <IntegrationsChannel />}
						<ExitSetting onClose={onClose} />
					</div>
					{showModal && <DeleteModal onClose={closeModal} channelLable={channel?.channel_label || ''} />}
				</div>
			) : null}
		</div>
	);
};

export default SettingChannel;
