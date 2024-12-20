import { selectCurrentChannelId, selectCurrentClanId } from '@mezon/store';
import { Icons } from '@mezon/ui';
import Tippy from '@tippy.js/react';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { usePushToTalk } from '../../../PushToTalk/PushToTalkContext';
import { useWebRTC } from '../../../WebRTC/WebRTCContext';

export interface IPushToTalkBtnProps {
	isLightMode: boolean;
}

export interface IPushToTalkBtnProps {
	isLightMode: boolean;
}

export const PushToTalkBtn: React.FC<IPushToTalkBtnProps> = ({ isLightMode }) => {
	const currentChannelId = useSelector(selectCurrentChannelId);
	const currentClanId = useSelector(selectCurrentClanId);

	const { setClanId, setChannelId, channelId } = useWebRTC();
	const { isJoined, startJoinPTT, quitPTT } = usePushToTalk();

	const shouldShowPtt = useMemo(() => {
		return isJoined === false || channelId === currentChannelId;
	}, [channelId, currentChannelId, isJoined]);

	return (
		shouldShowPtt && (
			<div className="relative flex gap-[15px] leading-5 h-5">
				<Tippy
					className={`w-[140px] flex justify-center items-center ${isLightMode ? 'tooltipLightMode' : 'tooltip'}`}
					content={isJoined ? 'Leave PTT' : 'Join PTT'}
				>
					<button
						onClick={
							!isJoined
								? () => {
										setClanId(currentClanId || '');
										setChannelId(currentChannelId || '');
										startJoinPTT();
									}
								: quitPTT
						}
						className="focus-visible:outline-none"
						onContextMenu={(e) => e.preventDefault()}
					>
						{isJoined ? (
							<div className="size-6 flex items-center justify-center">
								<Icons.JoinedPTT className="size-4 dark:hover:text-white hover:text-black dark:text-[#B5BAC1] text-colorTextLightMode" />
							</div>
						) : (
							<Icons.NotJoinedPTT className="size-6 dark:hover:text-white hover:text-black dark:text-[#B5BAC1] text-colorTextLightMode" />
						)}
					</button>
				</Tippy>
			</div>
		)
	);
};
