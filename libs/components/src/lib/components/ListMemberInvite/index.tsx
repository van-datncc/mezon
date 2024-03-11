import { useDMInvite } from '@mezon/core';
import { DirectEntity } from '@mezon/store';
import { ChangeEvent, useMemo, useState } from 'react';
import * as Icons from '../Icons';
import ListMemberInviteItem from './ListMemberInviteItem';
export type ModalParam = {
	url: string;
	channelID?: string;
};
const ListMemberInvite = (props: ModalParam) => {
	const { listDMInvite } = useDMInvite(props.channelID);
	const [searchTerm, setSearchTerm] = useState('');
	const [sendIds, setSendIds] = useState<Record<string, boolean>>({});
	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const filteredListBySearch = useMemo(() => {
		return listDMInvite.filter((dmGroup) => {
			return dmGroup.channel_lable?.toLowerCase().includes(searchTerm.toLowerCase());
		});
	}, [listDMInvite, searchTerm]);
	const handleSend = (dmGroup: DirectEntity) => {
		setSendIds((ids) => {
			return {
				...ids,
				[dmGroup.id]: true,
			};
		});
	};

	return (
		<>
			<input
				type="text"
				value={searchTerm}
				onChange={handleInputChange}
				placeholder="Search"
				className=" w-full h-10 border border-solid border-black bg-black rounded-[5px] px-[16px] py-[13px] text-[14px] placeholder-gray-600"
			/>
			<div className="absolute right-[28px] top-[26px] text-[#AEAEAE]">
            <Icons.Search/>
            </div>

			<p className="ml-[0px] mt-[16px] mb-[16px] text-[#AEAEAE] text-[16px]">
				This channel is private, only select members and roles can view this channel.
			</p>
			<hr className="border-solid border-borderDefault rounded-t "></hr>
			<div className="py-[10px]">
				{filteredListBySearch.map((dmGroup) => (
					<ListMemberInviteItem dmGroup={dmGroup} key={dmGroup.id} url={props.url} onSend={handleSend} isSent={!!sendIds[dmGroup.id]} />
				))}
			</div>
			<hr className="border-solid border-borderDefault rounded-t " />
		</>
	);
};

export default ListMemberInvite;
