import { IChannel } from '@mezon/utils';
import { useState } from 'react';
import ChannelSettingItem from './channelSettingItem';
import DeleteChannel from './deleteChannel';
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
	const [currentSetting, setCurrentSetting] = useState<string>('Overview');
	const handleSettingItemClick = (settingName: string) => {
		setCurrentSetting(settingName);
	};

	return (
		<div>
			{open ? (
				<div className="  flex fixed inset-0  w-screen z-10">
					<div className="flex text-gray- w-screen relative">
						<ChannelSettingItem onItemClick={handleSettingItemClick} channel={channel} />
						{currentSetting === 'Overview' && <OverviewChannel channel={channel} />}
						{currentSetting === 'Permissions' && <PermissionsChannel />}
						{currentSetting === 'Invites' && <InvitesChannel />}
						{currentSetting === 'Integrations' && <IntegrationsChannel />}
						{currentSetting === 'Delete' && <DeleteChannel />}
						<ExitSetting onClose={onClose} />
					</div>
				</div>
			) : null}
		</div>
	);
};

export default SettingChannel;
