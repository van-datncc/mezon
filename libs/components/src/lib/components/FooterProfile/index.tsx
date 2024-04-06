import { ChannelType } from '@mezon/mezon-js';
import { ChannelsEntity, selectStatusCall, useAppDispatch, voiceActions } from '@mezon/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { HeadPhoneICon, MicIcon, SettingProfile } from '../Icons';
import MemberProfile from '../MemberProfile';
import VoiceControlPanel from '../VoiceControlPanel';

export type FooterProfileProps = {
	name: string;
	status?: boolean;
	avatar: string;
	openSetting: () => void;
	channelCurrent?: ChannelsEntity | null;
};

function FooterProfile({ name, status, avatar, openSetting, channelCurrent }: FooterProfileProps) {
	const dispatch = useAppDispatch();
	const showScreen = useSelector(selectStatusCall);
	const checkTypeChannel = channelCurrent?.type === ChannelType.CHANNEL_TYPE_VOICE;
	useEffect(() => {
		if (checkTypeChannel) {
			dispatch(voiceActions.setStatusCall(checkTypeChannel));
		}
	}, [channelCurrent?.type]);
	return (
		<div>
			{showScreen && <VoiceControlPanel channelCurrent={channelCurrent} />}
			<button
				className="flex items-center justify-between border-t-2
			 border-borderDefault px-4 py-2 font-title text-[15px] 
			 font-[500] text-white hover:bg-gray-550/[0.16] 
			 shadow-sm transition absolute bottom-0 bg-bgSurface 
			 w-full group"
			>
				<MemberProfile
					name={name}
					status={status}
					avatar={avatar}
					isHideStatus={false}
					numberCharacterCollapse={15}
					classParent="memberProfile"
				/>
				<div className="flex items-center gap-2 iconHover bgHover">
					<MicIcon className="ml-auto w-[18px] h-[18px] opacity-80 iconRed" />
					<HeadPhoneICon className="ml-auto w-[18px] h-[18px] opacity-80" />
					<SettingProfile className="ml-auto w-[18px] h-[18px] opacity-80 text-[#AEAEAE]" onClick={openSetting} />
				</div>
			</button>
		</div>
	);
}

export default FooterProfile;
