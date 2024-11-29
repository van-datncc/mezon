import ItemPanel from '../PanelChannel/ItemPanel';
import { useWebRTC } from '../WebRTC/WebRTCContext';
import { usePushToTalk } from './PushToTalkContext';

const PushToTalkPanelChannel: React.FC<{ channelId: string }> = ({ channelId }) => {
	const { setChannelId } = useWebRTC();
	const { isJoined, startJoinPTT, quitPTT } = usePushToTalk();

	return isJoined ? (
		<ItemPanel
			children="Stop talking"
			onClick={() => {
				quitPTT();
			}}
		/>
	) : (
		<ItemPanel
			children="Push to talk"
			onClick={() => {
				setChannelId(channelId);
				startJoinPTT();
			}}
		/>
	);
};

export default PushToTalkPanelChannel;
