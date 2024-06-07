import { EventManagementEntity, selectChannelById, selectChannelFirst, selectMemberByUserId } from '@mezon/store';
import * as Icons from '../../../Icons';
import { useSelector } from 'react-redux';
import { OptionEvent } from '@mezon/utils';
import { useApp, useEventManagement } from '@mezon/core';
import { timeFomat } from '../timeFomatEvent';
import { Tooltip } from 'flowbite-react';

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
	const { setChooseEvent } = useEventManagement();
	const channelFirst = useSelector(selectChannelFirst);
	const channelVoice = useSelector(selectChannelById(voiceChannel));
	const userCreate = useSelector(selectMemberByUserId(event?.creator_id || ''));
	const { appearanceTheme } = useApp();

    return (
        <div 
			className="dark:bg-black bg-bgModifierHoverLight rounded-lg overflow-hidden"
			onClick={(setOpenModalDetail && event) ? () => {setOpenModalDetail(true); setChooseEvent(event);} : () => {}}
		>
				{logo && <img src={logo} alt='logo' className='w-full max-h-[180px] object-cover'/>}
				<div className="p-4 border-b dark:border-slate-600 border-white">
					<div className='flex justify-between'>
						<div className="flex items-center gap-x-2 mb-4">
							<Icons.IconEvents />
							<p className="font-semibold dark:text-zinc-400 text-colorTextLightMode">{timeFomat(start)}</p>
						</div>
						{ event?.creator_id && 
							<Tooltip content={`Created by ${userCreate?.user?.username}`} trigger="hover" animation="duration-500" style={appearanceTheme==='light' ? 'light' : 'dark'}>
								<img src={userCreate?.user?.avatar_url} alt={userCreate?.user?.avatar_url} className="size-6 rounded-full"/>
							</Tooltip> 
						}
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