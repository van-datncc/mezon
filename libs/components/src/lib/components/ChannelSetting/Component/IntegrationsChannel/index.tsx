import { selectAllWebhooks } from "@mezon/store";
import { useSelector } from "react-redux";
import Integrations from "../../../ClanSettings/Integrations";
import { IChannel } from "@mezon/utils";

interface IIntegrationsChannelProps{
	currentChannel?: IChannel;
}

const IntegrationsChannel = ({currentChannel}:IIntegrationsChannelProps) => {
	return (
		<div className="dark:bg-bgPrimary bg-bgLightModeSecond max-sm:px-0 px-[40px] overflow-y-auto hide-scrollbar">
			<Integrations currentChannel={currentChannel}/>
		</div>
	);
};

export default IntegrationsChannel;
