import { useDMInvite } from '@mezon/core';
import {
	DirectEntity,
	FriendsEntity,
	selectAllDirectMessages,
	selectAllFriends,
	selectAllMembersInClan,
	selectTheme,
	useAppSelector
} from '@mezon/store';
import { UsersClanEntity } from '@mezon/utils';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useThrottledCallback } from 'use-debounce';
import ListMemberInviteItem from './ListMemberInviteItem';
import { processUserData } from './dataHelper';
export type ModalParam = {
	url: string;
	channelID?: string;
	isInviteExternalCalling?: boolean;
};
const ListMemberInvite = (props: ModalParam) => {
	const appearanceTheme = useSelector(selectTheme);
	const { isInviteExternalCalling = false } = props;
	const { listDMInvite, listUserInvite } = useDMInvite(props.channelID);
	const [searchTerm, setSearchTerm] = useState('');
	const [sendIds, setSendIds] = useState<Record<string, boolean>>({});
	const [filteredListDMBySearch, setFilterListSearch] = useState<DirectEntity[] | undefined>(listDMInvite);

	const handleFilterListSearch = useCallback(() => {
		if (!searchTerm.trim()) {
			setFilterListSearch(listDMInvite);
			return;
		}

		const listSearch = listDMInvite?.filter((dmGroup) => {
			if (dmGroup.usernames?.toString()?.toLowerCase().includes(searchTerm.toLowerCase())) {
				return dmGroup.usernames?.toString()?.toLowerCase().includes(searchTerm.toLowerCase());
			}
			return dmGroup.channel_label?.toLowerCase().includes(searchTerm.toLowerCase());
		});
		setFilterListSearch(listSearch);
	}, [searchTerm, listDMInvite]);

	useEffect(() => {
		if (!searchTerm.trim()) {
			setFilterListSearch(listDMInvite);
		} else {
			handleFilterListSearch();
		}
	}, [listDMInvite, searchTerm, handleFilterListSearch]);

	const throttledSetSearchTerm = useThrottledCallback(handleFilterListSearch, 300);
	const handleInputChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setSearchTerm(e.target.value);
			throttledSetSearchTerm();
		},
		[throttledSetSearchTerm]
	);

	const filteredListUserBySearch = useMemo(() => {
		return listUserInvite?.filter((dmGroup) => {
			return dmGroup.user?.display_name?.toLowerCase().includes(searchTerm.toLowerCase());
		});
	}, [listUserInvite, searchTerm]);

	const handleSend = (dmGroup: DirectEntity) => {
		setSendIds((ids) => {
			return {
				...ids,
				[dmGroup.id]: true
			};
		});
	};

	const dmGroupChatListRef = useRef(useAppSelector(selectAllDirectMessages));
	///
	const membersClan = useSelector(selectAllMembersInClan);
	const dmGroupChatList = dmGroupChatListRef.current;
	const friends = useSelector(selectAllFriends);

	const dataUserToInvite = useMemo(
		() => processUserData(membersClan as UsersClanEntity[], dmGroupChatList as DirectEntity[], friends as FriendsEntity[]),
		[membersClan, dmGroupChatList, friends]
	);

	const filteredDataToInvite = useMemo(() => {
		if (!searchTerm) {
			return dataUserToInvite;
		}

		return dataUserToInvite.filter(
			(item) =>
				item?.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
				item?.clan_nick?.toLowerCase().includes(searchTerm?.toLowerCase())
		);
	}, [searchTerm, dataUserToInvite]);

	return (
		<>
			<input
				type="text"
				value={searchTerm}
				onChange={handleInputChange}
				placeholder="Search for friends"
				className="w-full h-10 mb-1 bg-theme-input rounded-lg px-[16px] py-[13px] text-[14px] outline-none"
			/>
			<p className="ml-[0px] mt-1 mb-4  text-[15px] cursor-default">
				This channel is private, only select members and roles can view this channel.
			</p>

			<hr className="border-t-theme-primary"></hr>
			<div className={`py-[10px] cursor-default overflow-y-auto max-h-[200px] overflow-x-hidden thread-scroll `}>
				{isInviteExternalCalling ? (
					<div className="flex flex-col gap-3">
						{filteredDataToInvite?.length > 0 ? (
							filteredDataToInvite.map((user, index) => (
								<ListMemberInviteItem
									dmGroup={undefined}
									user={user as UsersClanEntity}
									key={`${index}${user.id}`}
									url={props.url}
									onSend={handleSend}
									isSent={!!sendIds[user.id as string]}
									isExternalCalling={true}
									usersInviteExternal={user}
								/>
							))
						) : (
							<span>No result</span>
						)}
					</div>
				) : listDMInvite ? (
					<div className="flex flex-col gap-3">
						{filteredListDMBySearch?.map((dmGroup) => (
							<ListMemberInviteItem
								dmGroup={dmGroup}
								key={dmGroup.id}
								url={props.url}
								onSend={handleSend}
								isSent={!!sendIds[dmGroup.id]}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{filteredListUserBySearch?.map((user) => (
							<ListMemberInviteItem user={user} key={user.id} url={props.url} onSend={handleSend} isSent={!!sendIds[user.id]} />
						))}
					</div>
				)}
			</div>
			<hr className="border-t-theme-primary rounded-t " />
		</>
	);
};

export default ListMemberInvite;
