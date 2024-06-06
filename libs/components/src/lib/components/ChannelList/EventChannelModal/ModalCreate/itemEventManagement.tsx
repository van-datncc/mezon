import { EventManagementEntity, selectChannelById, selectChannelFirst } from '@mezon/store';
import * as Icons from '../../../Icons';
import { useSelector } from 'react-redux';
import { OptionEvent } from '@mezon/utils';

export type ItemEventManagementProps = {
	option: string;
	topic: string;
	voiceChannel: string;
	titleEvent: string;
	address?: string;
	logo?: string;
	logoRight?: string;
	start: string; 
	event?: EventManagementEntity;
	setOpenModalDetail?: (status: boolean) => void;
};

const ItemEventManagement = (props: ItemEventManagementProps)=>{
    const { topic, voiceChannel, titleEvent, option, address, logo, logoRight, start, event, setOpenModalDetail } = props;
	const channelFirst = useSelector(selectChannelFirst);
	const channelVoice = useSelector(selectChannelById(voiceChannel));
	const timeFomat = () => {
		const date = new Date(start);

		const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const dayName = daysOfWeek[date.getUTCDay()];

		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		const monthName = months[date.getUTCMonth()];

		const day = date.getUTCDate();

		const hours = date.getUTCHours().toString().padStart(2, '0');
		const minutes = date.getUTCMinutes().toString().padStart(2, '0');

		return `${dayName} ${monthName} ${day} - ${hours}:${minutes}`;
	};

    return (
        <div 
			className="dark:bg-black bg-bgModifierHoverLight rounded-lg overflow-hidden"
			onClick={setOpenModalDetail ? () => setOpenModalDetail(true) : () => {}}
		>
				{logo && <img src={logo} alt='logo' className='w-full max-h-[180px] object-cover'/>}
				<div className="p-4 border-b dark:border-slate-600 border-white">
					<div className="flex items-center gap-x-2 mb-4">
						<Icons.IconEvents />
						<p className="font-semibold dark:text-zinc-400 text-colorTextLightMode">{timeFomat()}</p>
					</div>
					<div className='flex justify-between'>
						<p className="hover:underline font-bold dark:text-white text-black flex-grow basis-3/5">{topic}</p>
						{logoRight && <img src={logoRight} alt='logoRight' className='w-[60%] max-h-[100px] object-cover rounded flex-grow basis-2/5'/>}
					</div>
				</div>
				<div className="p-4 flex items-center gap-x-2">
					{option === OptionEvent.OPTION_SPEAKER && (
						<>
							<Icons.Speaker />
							<p>{channelVoice?.channel_label}</p>
						</>
					)}
					{option === OptionEvent.OPTION_LOCATION  && 
						<>
							<Icons.Location />
							<p>{titleEvent}</p>
						</>
					}
					{option === '' && !address && !channelVoice && (
						<>
							<Icons.Location />
							<p className="hover:underline text-slate-400">{channelFirst.channel_label}</p>
						</>
					)}
				</div>
			</div>
    );
}

export default ItemEventManagement;