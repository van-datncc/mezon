import { selectAppChannelById, selectTheme, useAppSelector } from '@mezon/store';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ChannelApps } from '../pages/channel/ChannelApp';

const CanvasLayout = () => {
	const { channelId } = useParams();
	const channelApp = useAppSelector((state) => selectAppChannelById(state, channelId || ''));
	const appearanceTheme = useSelector(selectTheme);
	return (
		<div
			className={`flex flex-1 justify-center overflow-y-scroll overflow-x-hidden ${appearanceTheme === 'light' ? 'customScrollLightMode' : ''}`}
		>
			<ChannelApps appChannel={channelApp} />
		</div>
	);
};

export default CanvasLayout;
