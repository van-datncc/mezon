import { selectChannelById, selectChannelFirst } from '@mezon/store';
import * as Icons from '../../../Icons';
import { useSelector } from 'react-redux';

enum OptionEvent {
	OPTION_SPEAKER = 'Speaker',
	OPTION_HASTAG = 'Hashtag',
}

export type ItemEventManagementProps = {
	option: string;
	topic: string;
	voiceChannel: string;
	titleEvent: string;
	address?: string;
};

const ItemEventManagement = (props: ItemEventManagementProps)=>{
    const { topic, voiceChannel, titleEvent, option, address } = props;
	const channelFirst = useSelector(selectChannelFirst);
	const channelVoice = useSelector(selectChannelById(voiceChannel));


    return (
        <div className="dark:bg-black bg-bgModifierHoverLight rounded-lg overflow-hidden">
				<div className="p-4 border-b border-slate-600">
					<div className="flex items-center gap-x-2 mb-4">
						<Icons.EventIcon />
						<p className="font-semibold text-[#959CF7]">Event</p>
					</div>
					<p className="hover:underline font-bold dark:text-white text-black">{topic}</p>
				</div>
				<div className="p-4 flex items-center gap-x-2">
					{option == OptionEvent.OPTION_SPEAKER || channelVoice && (
						<>
							<Icons.Speaker />
							<p>{channelVoice.channel_label}</p>
						</>
					)}
					{option == OptionEvent.OPTION_HASTAG || address && 
						<>
							<Icons.Hashtag />
							<p>{titleEvent}</p>
						</>
					}
					{option == '' && !address && !channelVoice && (
						<>
							<Icons.Hashtag />
							<p className="hover:underline text-slate-400">{channelFirst.channel_label}</p>
						</>
					)}
				</div>
			</div>
    );
}

export default ItemEventManagement;