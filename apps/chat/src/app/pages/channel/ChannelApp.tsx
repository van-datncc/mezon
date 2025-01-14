import { Loading } from '@mezon/ui';
import { ApiChannelAppResponse } from 'mezon-js/api.gen';
import { RefObject } from 'react';
import { useWebRTC } from '../../../components/WebRTC/WebRTCContext';

export function ChannelApps({
	appChannel,
	miniAppRef,
	miniAppDataHash
}: {
	appChannel: ApiChannelAppResponse;
	miniAppRef: RefObject<HTMLIFrameElement>;
	miniAppDataHash: string;
}) {
	const { setClanId, setChannelId, startLocalStream } = useWebRTC();
	setClanId(appChannel.clan_id || '');
	setChannelId(appChannel.channel_id || '');
	startLocalStream();
	return appChannel?.url ? (
		<iframe ref={miniAppRef} title={appChannel?.url} src={appChannel?.url + `#${miniAppDataHash}`} className={'w-full h-full'}></iframe>
	) : (
		<div className={'w-full h-full flex items-center justify-center'}>
			<Loading />
		</div>
	);
}
