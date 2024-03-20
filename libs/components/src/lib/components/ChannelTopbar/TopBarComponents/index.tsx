import { useEffect, useRef, useState } from 'react';
import * as Icons from '../../Icons';
import { ChannelProps, ChannelStatusEnum, ThreadNameProps } from '@mezon/utils';
import { ChannelType } from '@mezon/mezon-js';

export const ChannelLabel: React.FC<ChannelProps> = ({ isPrivate, type, name }) => {
	return (
		<div className="flex flex-row items-center relative">
			<div className="absolute flex text-zinc-400 text-lg font-['Manrope'] pb-0">
				{isPrivate === ChannelStatusEnum.isPrivate && type === ChannelType.CHANNEL_TYPE_VOICE && <Icons.SpeakerLocked defaultSize="w-6 h-6" />}
				{isPrivate === ChannelStatusEnum.isPrivate && type === ChannelType.CHANNEL_TYPE_TEXT && <Icons.HashtagLocked defaultSize="w-6 h-6 " />}
				{isPrivate === undefined && type === ChannelType.CHANNEL_TYPE_VOICE && <Icons.Speaker defaultSize="w-6 h-6" />}
				{isPrivate === undefined && type === ChannelType.CHANNEL_TYPE_TEXT && <Icons.Hashtag defaultSize="w-6 h-6" />}
			</div>

			<p className="mb-0.5 text-zinc-400 font-thin font-['Manrope'] ml-7 mt-2">{name}</p>
		</div>
	);
};

export const ThreadLable: React.FC<ThreadNameProps> = ({ name }) => {
	return (
		<div className="items-center flex flex-row gap-1">
			<Icons.ArrowToThread />
			<Icons.ThreadNotClick />
			<p className="text-white mb-0.5 font-thin font-['Manrope']"> {name}</p>
		</div>
	);
};

export const SearchMessage: React.FC = () => {
	const [expanded, setExpanded] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const handleInputClick = () => {
		setExpanded(!expanded);
	};
	const handleOutsideClick = (event: MouseEvent) => {
		if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
			setExpanded(false);
		}
	};
	useEffect(() => {
		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, []);

	return (
		<div className="relative" ref={inputRef}>
			<div
				className={`transition-all duration-300 ${
					expanded ? 'w-80' : 'w-40'
				} h-8 pl-4 pr-2 py-3 bg-[#0B0B0B] rounded items-center inline-flex`}
			>
				<input
					type="text"
					placeholder="Search"
					className="text-[#AEAEAE] font-['Manrope'] placeholder-[#AEAEAE] outline-none bg-transparent w-full"
					onClick={handleInputClick}
				/>
			</div>
			<div className="w-5 h-6 flex flex-row items-center pl-1 absolute right-1 bg-[#0B0B0B] top-1/2 transform -translate-y-1/2">
				<Icons.Search />
			</div>
		</div>
	);
};
