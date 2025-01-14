import { Loading } from '@mezon/ui';
import { useWebRTC } from 'libs/components/src/lib/components/WebRTC/WebRTCContext';
import { ApiChannelAppResponse } from 'mezon-js/api.gen';
import { RefObject } from 'react';

export function ChannelApps({
	appChannel,
	miniAppRef,
	miniAppDataHash
}: {
	appChannel: ApiChannelAppResponse;
	miniAppRef: RefObject<HTMLIFrameElement>;
	miniAppDataHash: string;
}) {
	const { setClanId, setChannelId } = useWebRTC();
	setClanId(appChannel.clan_id || '');
	setChannelId(appChannel.channel_id || '');

	return appChannel?.url ? (
		<iframe ref={miniAppRef} title={appChannel?.url} src={appChannel?.url + `#${miniAppDataHash}`} className={'w-full h-full'}></iframe>
	) : (
		<div className={'w-full h-full flex items-center justify-center'}>
			<Loading />
		</div>
	);
}
