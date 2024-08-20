import { Dropdown } from "flowbite-react";
import { Icons } from "@mezon/ui"
import {ChannelsEntity, selectAllChannels, useAppSelector} from "@mezon/store";
import React, {useState} from "react";
import {ChannelType} from "mezon-js";

const SystemMessagesManagement = () => {
	const channelsList = useAppSelector(selectAllChannels);
	const channelsListWithoutVoiceChannel = channelsList.filter(channel => channel.type !== ChannelType.CHANNEL_TYPE_VOICE)
	const [selectedChannel, setSelectedChannel] = useState (channelsList[0]);
	
	const handleSelectChannel = (channel: ChannelsEntity) => {
		setSelectedChannel(channel)
	}
	
	return (
		<div className={'border-t dark:border-borderDivider border-borderDividerLight mt-10 pt-10 flex flex-col dark:text-textSecondary text-textSecondary800'}>
			<h3 className="text-sm font-bold uppercase mb-2">System Messages Channel</h3>
			<Dropdown
				placement={'bottom-start'}
				label={''}
				renderTrigger={() => (
					<div className="w-full h-10 rounded-md flex flex-row px-3 justify-between items-center uppercase text-xs dark:bg-bgInputDark bg-bgLightModeThird border dark:text-textPrimary text-textPrimaryLight">
						<p>{selectedChannel.channel_label}</p>
						<div><Icons.ArrowDownFill /></div>
					</div>
				)}
			>
				<div className={'h-[200px] text-xs overflow-y-scroll customSmallScrollLightMode'}>
					{
						channelsListWithoutVoiceChannel.map((channel) => {
							if (channel.channel_id !== selectedChannel.channel_id) {
								return (
									<div
										key={channel.id}
										className={'dark:text-textSecondary text-textSecondary800 rounded-sm dark:hover:bg-bgHover hover:bg-bgIconDark hover:text-textDarkTheme uppercase font-medium w-full py-[6px] px-[8px] text-left cursor-pointer list-none textWhiteHoverImportant m-0 truncate'}
										onClick={() => handleSelectChannel(channel)}
									>
										{channel.channel_label ?? ''}
									</div>
								)
							}
						})
					}
				</div>
			</Dropdown>
			<p className={'text-xs dark:text-textPrimary text-textPrimaryLight py-2'}>This is the channel we send system event messages to. These can be turned off at any time</p>
			<ToggleItem label={"Send a random welcome message when someone joins this server."} value={true} />
			<ToggleItem label={"Prompt members to reply to welcome messages with a sticker."} value={true} />
			<ToggleItem label={"Send a message when someone Boosts this server."} value={true} />
			<ToggleItem label={"Send helpful tips for server setup."} value={true} />
			
		</div>
	)
}

export default SystemMessagesManagement;

type ToggleItemProps = {
	label: string,
	value: boolean,
	handleToggle?: () => void
}

const ToggleItem: React.FC<ToggleItemProps> = ({label, value, handleToggle}) => {
	return (
		<div className="Frame347 self-stretch justify-start items-center gap-3 inline-flex text-sm">
			<div className="Frame409 grow shrink basis-0 h-6 justify-start items-center gap-1 flex">
				<p>{label}</p>
			</div>
			<div className="relative flex flex-wrap items-center">
				<input
					className="peer relative h-4 w-8 cursor-pointer appearance-none rounded-lg
               bg-slate-300 transition-colors after:absolute after:top-0 after:left-0 after:h-4 after:w-4 after:rounded-full
                after:bg-slate-500 after:transition-all checked:bg-blue-200 checked:after:left-4 checked:after:bg-blue-500
                 hover:bg-slate-400 after:hover:bg-slate-600 checked:hover:bg-blue-300 checked:after:hover:bg-blue-600
                  focus:outline-none checked:focus:bg-blue-400 checked:after:focus:bg-blue-700 focus-visible:outline-none disabled:cursor-not-allowed
                   disabled:bg-slate-200 disabled:after:bg-slate-300"
					type="checkbox"
					value={1}
					id="id-c01"
					onChange={handleToggle}
				/>
			</div>
		</div>
	)
}