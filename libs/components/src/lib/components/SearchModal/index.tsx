import { useAppNavigation, useAuth, useChannels, useDirect, useFriends } from '@mezon/core';
import {
	DirectEntity,
	IFriend,
	directActions,
	messagesActions,
	selectAllChannelMembers,
	selectAllDirectMessages,
	selectAllUsesClan,
	selectTheme,
	useAppDispatch,
} from '@mezon/store';
import { InputField } from '@mezon/ui';
import { TypeSearch, UsersClanEntity, addAttributesSearchList, findDisplayNameByUserId, removeDuplicatesById } from '@mezon/utils';
import { Modal } from 'flowbite-react';
import { ChannelType } from 'mezon-js';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ListSearchModal from './ListSearchModal';
export type SearchModalProps = {
	readonly open: boolean;
	onClose: () => void;
};

function SearchModal({ open, onClose }: SearchModalProps) {
	const { userProfile } = useAuth();
	const [searchText, setSearchText] = useState('');
	const accountId = userProfile?.user?.id ?? '';
	const { toDmGroupPageFromMainApp, toChannelPage, navigate } = useAppNavigation();
	const { createDirectMessageWithUser } = useDirect();
	const dmGroupChatList = useSelector(selectAllDirectMessages);
	const { listChannels } = useChannels();
	const listGroup = dmGroupChatList.filter((groupChat) => groupChat.type === 2);
	const listDM = dmGroupChatList.filter((groupChat) => groupChat.type === 3 && groupChat.channel_avatar);
	const usersClan = useSelector(selectAllUsesClan);
	const membersInClan = useSelector(selectAllChannelMembers);

	const { friends } = useFriends();
	const dispatch = useAppDispatch();
	const [idActive, setIdActive] = useState('');
	const boxRef = useRef<HTMLDivElement | null>(null);
	const itemRef = useRef<HTMLDivElement | null>(null);

	const appearanceTheme = useSelector(selectTheme);

	const listMemSearch = useMemo(() => {
		const listDMSearch = listDM?.length
			? listDM.map((itemDM: DirectEntity) => {
					return {
						id: itemDM?.user_id?.[0] ?? '',
						name: itemDM?.usernames ?? '',
						avatarUser: itemDM?.channel_avatar?.[0] ?? '',
						idDM: itemDM?.id ?? '',
						displayName: findDisplayNameByUserId(itemDM?.user_id?.[0] ?? '', membersInClan),
						lastSentTimeStamp: itemDM.last_sent_message?.timestamp,
						typeChat: ChannelType.CHANNEL_TYPE_DM,
						type: TypeSearch.Dm_Type,
					};
				})
			: [];
		const listGroupSearch = listGroup.length
			? listGroup.map((itemGr: DirectEntity) => {
					return {
						id: itemGr?.channel_id ?? '',
						name: itemGr?.channel_label ?? '',
						avatarUser: 'assets/images/avatar-group.png' ?? '',
						idDM: itemGr?.id ?? '',
						lastSentTimeStamp: itemGr.last_sent_message?.timestamp,
						typeChat: ChannelType.CHANNEL_TYPE_GROUP,
						type: TypeSearch.Dm_Type,
					};
				})
			: [];

		const listFriendsSearch = friends.length
			? friends.map((itemFriend: IFriend) => {
					return {
						id: itemFriend?.id ?? '',
						name: itemFriend?.user?.username ?? '',
						avatarUser: itemFriend?.user?.avatar_url ?? '',
						displayName: itemFriend?.user?.display_name ?? '',
						lastSentTimeStamp: '0',
						idDM: '',
						type: TypeSearch.Dm_Type,
					};
				})
			: [];

		const listUserClanSearch = usersClan.length
			? usersClan.map((itemUserClan: UsersClanEntity) => {
					return {
						id: itemUserClan?.id ?? '',
						name: itemUserClan?.user?.username ?? '',
						avatarUser: itemUserClan?.user?.avatar_url ?? '',
						displayName: itemUserClan?.user?.display_name ?? '',
						lastSentTimeStamp: '0',
						idDM: '',
						type: TypeSearch.Dm_Type,
					};
				})
			: [];

		const friendsMap = new Map(listFriendsSearch.map((friend) => [friend.id, friend]));
		const listSearch = [
			...listDMSearch.map((itemDM) => {
				const friend = friendsMap.get(itemDM.id);
				return friend ? { ...itemDM, displayName: friend.displayName || itemDM?.displayName } : itemDM;
			}),
			...listGroupSearch,
			...listUserClanSearch,
		];
		const removeDuplicate = removeDuplicatesById(listSearch.filter((item) => item.id !== accountId));
		const addPropsIntoSearchList = useMemo(() => addAttributesSearchList(removeDuplicate, membersInClan), [removeDuplicate, membersInClan]);

		return addPropsIntoSearchList;
	}, [accountId, friends, listDM, listGroup, membersInClan]);

	const listChannelSearch = useMemo(() => {
		const list = listChannels.map((item) => {
			return {
				id: item?.channel_id ?? '',
				name: item?.channel_label ?? '',
				subText: item?.category_name ?? '',
				icon: '#',
				clanId: item?.clan_id ?? '',
				channelId: item?.channel_id ?? '',
				lastSentTimeStamp: Number(item?.last_sent_message?.timestamp || 0),
				type: TypeSearch.Channel_Type,
				prioritizeName: item?.channel_label ?? '',
			};
		});
		const sortedList = list.slice().sort((a, b) => b.lastSentTimeStamp - a.lastSentTimeStamp);
		return sortedList;
	}, [listChannels]);

	const totalsData = [...listMemSearch, ...listChannelSearch];

	const handleSelectMem = useCallback(
		async (user: any) => {
			if (user?.idDM) {
				dispatch(directActions.openDirectMessage({ channel_id: user.idDM || '' }));
				const result = await dispatch(
					directActions.joinDirectMessage({
						directMessageId: user.idDM,
						channelName: '',
						type: user?.typeChat ?? ChannelType.CHANNEL_TYPE_DM,
					}),
				);
				if (result) {
					navigate(toDmGroupPageFromMainApp(user.idDM, user?.typeChat ?? ChannelType.CHANNEL_TYPE_DM));
				}
			} else {
				const response = await createDirectMessageWithUser(user.id);
				if (response.channel_id) {
					const directChat = toDmGroupPageFromMainApp(response.channel_id, Number(response.type));
					navigate(directChat);
				}
			}
			onClose();
		},
		[createDirectMessageWithUser, navigate, onClose, toDmGroupPageFromMainApp],
	);

	const handleSelectChannel = useCallback(
		async (channel: any) => {
			const directChannel = toChannelPage(channel.id, channel.clanId);
			navigate(directChannel);
			onClose();
		},
		[navigate, onClose, toChannelPage],
	);

	const handleSelect = useCallback(
		async (isChannel: boolean, item: any) => {
			if (isChannel) {
				await handleSelectChannel(item);
			} else {
				await handleSelectMem(item);
			}
		},
		[handleSelectMem, handleSelectChannel],
	);

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
		}
	};

	const isNoResult =
		!listChannelSearch.filter((item) => item.name.indexOf(searchText) > -1).length &&
		!listMemSearch.filter((item: any) => item.name.indexOf(searchText) > -1).length;

	useEffect(() => {
		const memSearchs = listMemSearch
			.filter((item: any) => item.name.indexOf(searchText.startsWith('@') ? searchText.substring(1) : searchText) > -1)
			.slice(0, searchText.startsWith('@') ? 25 : 7);
		const channelSearchs = listChannelSearch
			.filter((item) => item.name.indexOf(searchText.startsWith('#') ? searchText.substring(1) : searchText) > -1)
			.slice(0, searchText.startsWith('#') ? 25 : 8);
		const totalLists = memSearchs.concat(channelSearchs);

		if (idActive === '') {
			setIdActive(totalLists[0]?.id ?? '');
		}

		let maxHight = itemRef.current?.clientHeight ?? 0;

		const boxHight = boxRef.current?.clientHeight ?? 0;
		const handleKeyDown = (event: KeyboardEvent) => {
			const nextIndex = (currentIndex: number, length: number) => (currentIndex === length - 1 ? 0 : currentIndex + 1);
			const prevIndex = (currentIndex: number) => (currentIndex === 0 ? totalLists.length - 1 : currentIndex - 1);
			const itemSelect = totalLists.find((item: any) => item.id === idActive);

			switch (event.key) {
				case 'ArrowDown':
					if (itemRef && itemRef.current) {
						maxHight =
							itemRef.current.clientHeight *
							(nextIndex(
								totalLists.findIndex((item: any) => item.id === idActive),
								totalLists.length,
							) +
								1);

						if (maxHight > boxHight) {
							boxRef.current?.scroll({
								top: maxHight - boxHight + 46,
								behavior: 'smooth',
							});
						}
						if (maxHight === itemRef.current?.clientHeight) {
							boxRef.current?.scroll({
								top: 0,
								behavior: 'smooth',
							});
						}
					}
					setIdActive(
						totalLists[
							nextIndex(
								totalLists.findIndex((item: any) => item.id === idActive),
								totalLists.length,
							)
						]?.id ?? '',
					);
					break;
				case 'ArrowUp':
					if (itemRef && itemRef.current) {
						maxHight = itemRef.current.clientHeight * (prevIndex(totalLists.findIndex((item: any) => item.id === idActive)) + 1);

						if (maxHight > boxHight) {
							boxRef.current?.scroll({
								top: maxHight - boxHight + 46,
								behavior: 'smooth',
							});
						}
						if (maxHight === itemRef.current?.clientHeight) {
							boxRef.current?.scroll({
								top: 0,
								behavior: 'smooth',
							});
						}
					}
					setIdActive(totalLists[prevIndex(totalLists.findIndex((item: any) => item.id === idActive))]?.id ?? '');
					break;
				case 'Enter':
					if (itemSelect?.subText) {
						event.preventDefault();
						handleSelectChannel(totalLists.find((item: any) => item.id === idActive));
						dispatch(messagesActions.setIsFocused(true));
					} else {
						handleSelectMem(totalLists.find((item: any) => item.id === idActive));
					}
					break;

				default:
					break;
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleSelectChannel, handleSelectMem, idActive, listChannelSearch, listMemSearch, searchText]);

	return (
		<Modal
			show={open}
			dismissible={true}
			onClose={onClose}
			className="bg-[#111111] text-contentPrimary bg-opacity-90 focus-visible:[&>*]:outline-none"
		>
			<Modal.Body className="dark:bg-[#36393e] bg-bgLightMode px-6 py-4 rounded-[6px] h-[200px] w-full">
				<div className="flex flex-col">
					<InputField
						type="text"
						placeholder="Where would you like to go?"
						className="py-[18px] dark:bg-bgTertiary bg-bgLightModeThird dark:text-textDarkTheme text-textLightTheme text-[16px] mt-2 mb-[15px]"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						onKeyDown={(e) => handleInputKeyDown(e)}
					/>
				</div>
				<div
					ref={boxRef}
					className={`w-full max-h-[250px] overflow-x-hidden overflow-y-auto flex flex-col gap-[3px] pr-[5px] py-[10px] ${appearanceTheme === 'light' ? 'customScrollLightMode' : ''}`}
				>
					{!searchText.startsWith('@') && !searchText.startsWith('#') ? (
						<>
							<ListSearchModal
								listSearch={totalsData}
								itemRef={itemRef}
								handleSelect={handleSelect}
								searchText={searchText}
								idActive={idActive}
								setIdActive={setIdActive}
							/>
							{isNoResult && (
								<span className=" flex flex-row justify-center dark:text-white text-colorTextLightMode">
									Can't seem to find what you're looking for?
								</span>
							)}
						</>
					) : (
						<>
							{searchText.startsWith('@') && (
								<>
									<span className="text-left opacity-60 text-[11px] pb-1 uppercase">Search friend and users</span>
									<ListSearchModal
										listSearch={listMemSearch}
										itemRef={itemRef}
										handleSelect={handleSelect}
										searchText={searchText}
										idActive={idActive}
										setIdActive={setIdActive}
									/>
								</>
							)}
							{searchText.startsWith('#') && (
								<>
									<span className="text-left opacity-60 text-[11px] pb-1 uppercase">Searching channel</span>
									<ListSearchModal
										listSearch={listChannelSearch}
										itemRef={itemRef}
										handleSelect={handleSelect}
										searchText={searchText.slice(1)}
										idActive={idActive}
										setIdActive={setIdActive}
									/>
								</>
							)}
						</>
					)}
				</div>
				<FooterNoteModal />
			</Modal.Body>
		</Modal>
	);
}

export default memo(SearchModal);

const FooterNoteModal = memo(() => {
	return (
		<div className="pt-2">
			<span className="text-[13px] font-medium dark:text-contentTertiary text-textLightTheme">
				<span className="text-[#2DC770] opacity-100 font-bold">PROTIP: </span>Start searches with @, # to narrow down results.
			</span>
		</div>
	);
});

[
	{
		id: '1775731111020728320',
		name: 'thai.phamquoc',
		avatarUser: 'https://cdn.mezon.vn/1775732550744936448/0/image.JPEG',
		idDM: '1812788655488503808',
		displayName: '',
		lastSentTimeStamp: '1722695857',
		typeChat: 3,
		type: 1,
		clanAvatar: 'https://cdn.mezon.vn/0/0/000002.JPEG',
		clanNick: '332sss',
		prioritizeName: '332sss',
	},
	{
		id: '1775732201627848704',
		name: 'an.buihoang',
		avatarUser: 'https://cdn.mezon.vn/1775732550778490880/1719474173356DSCF9416_01.jpeg',
		idDM: '1813225903174455296',
		displayName: 'an.bui',
		lastSentTimeStamp: '1722655923',
		typeChat: 3,
		type: 1,
		clanNick: 'ahihi',
		prioritizeName: 'ahihi',
	},
	{
		id: '1775735043696627712',
		name: 'minh.lucvan',
		avatarUser: 'https://lh3.googleusercontent.com/a/ACg8ocL4AIYzfZjZM5hgXQ_uOhXVYssKHHUb1bJWX2NToCacF-pqpxfY=s96-c',
		idDM: '1813520024090972160',
		displayName: 'Minh Luc Van',
		typeChat: 3,
		type: 1,
		clanAvatar: '',
		clanNick: '',
		prioritizeName: 'Minh Luc Van',
	},
	{
		id: '1775731911755304960',
		name: 'thuy.nguyenthithu1',
		avatarUser: 'https://cdn.mezon.vn/1809130375721521152/1721709627104download__1_.jfifJPEG',
		idDM: '1816701610470936576',
		displayName: 'Thuy 1 Nguyen Thi Thu',
		lastSentTimeStamp: '1722669460',
		typeChat: 3,
		type: 1,
		clanNick: 'thuy.nguyenthithu1',
		prioritizeName: 'Thuy 1 Nguyen Thi Thu',
	},
	{
		id: '1813062275754364928',
		name: 'huyetlinh1901',
		avatarUser: 'https://lh3.googleusercontent.com/a/ACg8ocLJZ6if8GTXnk8nTWKM4uBLzqTi2yREu65fCszAtuZ44WfOPIx2=s96-c',
		idDM: '1816395726142312448',
		displayName: '',
		lastSentTimeStamp: '1722669431',
		typeChat: 3,
		type: 1,
		prioritizeName: 'huyetlinh1901',
	},
	{
		id: '1784059393956909056',
		name: 'namphongnguyen129',
		avatarUser: 'https://lh3.googleusercontent.com/a/ACg8ocIdHbcYm9MLwSw3yxjwXcdH8TvcpH5spj43nSF4ZiyDNgwwKi14=s96-c',
		idDM: '1819223348710739968',
		displayName: 'Nam Phong',
		lastSentTimeStamp: '1722652217',
		typeChat: 3,
		type: 1,
		clanAvatar: 'https://cdn.mezon.vn/0/0/000002.JPEG',
		clanNick: '222ddd',
		prioritizeName: '222ddd',
	},
	{
		id: '1787691797724532736',
		name: 'tung.nguyenquyson',
		avatarUser: 'https://cdn.mezon.vn/1816470851059453952/1721969016915avas.JPEG',
		idDM: '1818102783593680896',
		displayName: 'Tung Nguyen Quy Son',
		lastSentTimeStamp: '1722569096',
		typeChat: 3,
		type: 1,
		clanNick: 'tung.nguyenquyson',
		prioritizeName: 'Tung Nguyen Quy Son',
	},
	{
		id: '1808345368379789312',
		name: 'thang.tranhuy',
		avatarUser: 'https://lh3.googleusercontent.com/a/ACg8ocKHCmBR5k2YMw40_DIz10MfHywTBWPD-4ZOknwXRo7BerG4_Q=s96-c',
		idDM: '1819201048821108736',
		displayName: '',
		lastSentTimeStamp: '1722566304',
		typeChat: 3,
		type: 1,
		prioritizeName: 'thang.tranhuy',
	},
	{
		id: '1816736446422192128',
		name: 'Nga DisplayName,Thuy 1 Nguyen Thi Thu',
		avatarUser: 'assets/images/avatar-group.png',
		idDM: '1816736446422192128',
		lastSentTimeStamp: '1722496417',
		typeChat: 2,
		type: 1,
		clanAvatar: '',
		clanNick: '',
		prioritizeName: 'Nga DisplayName,Thuy 1 Nguyen Thi Thu',
	},
	{
		id: '1816730137756962816',
		name: 'Thai_display-2,Nga DisplayName,Thuy 1 Nguyen Thi Thu,an.bui',
		avatarUser: 'assets/images/avatar-group.png',
		idDM: '1816730137756962816',
		lastSentTimeStamp: '1722419124',
		typeChat: 2,
		type: 1,
		clanAvatar: '',
		clanNick: '',
		prioritizeName: 'Thai_display-2,Nga DisplayName,Thuy 1 Nguyen Thi Thu,an.bui',
	},
	{
		id: '1775730169877630976',
		name: 'nguyentran',
		avatarUser: 'https://cdn.mezon.vn/1775732550778490880/1721652332717froge_handsup.gifJPEG',
		displayName: 'Nhan Nguyen',
		lastSentTimeStamp: '0',
		idDM: '',
		type: 1,
		clanNick: 'nguyentran',
		prioritizeName: 'Nhan Nguyen',
	},
	{
		id: '1777888757442154496',
		name: 'vy.phamthimai',
		avatarUser: 'https://lh3.googleusercontent.com/a/ACg8ocIlYMx0W_d4A1aVC-xjwYcaijTvlHn8D882XhqkvTpcVy0KbA=s96-c',
		displayName: 'Vy Pham Thi Mai',
		lastSentTimeStamp: '0',
		idDM: '',
		type: 1,
		clanNick: 'vy.phamthimai',
		prioritizeName: 'Vy Pham Thi Mai',
	},
	{
		id: '1788103935005822976',
		name: 'nga.nguyenthi',
		avatarUser: 'https://lh3.googleusercontent.com/a/ACg8ocKtmq0cUQkFuJSBJSztZSRiEBifa1NUh-LE4jHLJoigEYdW8A=s96-c',
		displayName: 'Nga DisplayName',
		lastSentTimeStamp: '0',
		idDM: '',
		type: 1,
		clanAvatar: 'blob:https://dev-mezon.nccsoft.vn/02ff10d9-1da3-435b-a710-91356577a355',
		clanNick: 'nga.nguyenthi komu',
		prioritizeName: 'nga.nguyenthi komu',
	},
	{
		id: '1775734958942326784',
		name: 'luk.mink',
		avatarUser: 'https://lh3.googleusercontent.com/a/ACg8ocKdZWvUldu8nd_5qGO5bFf3QhEk8PdlUAIj4vf-axGIwmMK06wT=s96-c',
		displayName: 'Minh Luc',
		lastSentTimeStamp: '0',
		idDM: '',
		type: 1,
		clanNick: 'luk.mink',
		prioritizeName: 'Minh Luc',
	},
	{
		id: '1801146235533398016',
		name: 'duy.vannhat',
		avatarUser: 'https://lh3.googleusercontent.com/a/ACg8ocLltj56DFo3o93n9zrZiH52XQ6ykMl8ODhvAUP7tXFNOsXFVWdt=s96-c',
		displayName: 'Duy Van Nhat',
		lastSentTimeStamp: '0',
		idDM: '',
		type: 1,
		clanNick: 'duy.vannhat',
		prioritizeName: 'Duy Van Nhat',
	},
	{
		id: '1780188277182042112',
		name: 'pocolomos',
		avatarUser: 'https://lh3.googleusercontent.com/a/ACg8ocIkW-J1LswufXHTnJLuEOh0HN6bLRUYXT0RZmpWj9p0mbr7tSyi=s96-c',
		displayName: 'Nguyen Tran Nhan',
		lastSentTimeStamp: '0',
		idDM: '',
		type: 1,
		clanNick: 'pocolomos',
		prioritizeName: 'Nguyen Tran Nhan',
	},
	{
		id: '1793196223801331712',
		name: 'thiet.nguyenba',
		avatarUser: 'https://lh3.googleusercontent.com/a/ACg8ocKyK9dgzyYM8XgPjgS37pj-ZcVq3kr36DWdBfGMWITRmycZErAr=s96-c',
		displayName: 'Thiet Nguyen Ba',
		lastSentTimeStamp: '0',
		idDM: '',
		type: 1,
		clanNick: 'thiet.nguyenba',
		prioritizeName: 'Thiet Nguyen Ba',
	},
	{
		id: '1809059413005176832',
		name: 'quan.hoangminh',
		avatarUser: 'https://lh3.googleusercontent.com/a/ACg8ocK4ASvAQKd_ElZSjb0oZNKJCJ5fCCIftTs55UjKo4A1CbiR1Q=s96-c',
		displayName: 'Quan Hoang Minh Quan Hoang Minh ',
		lastSentTimeStamp: '0',
		idDM: '',
		type: 1,
		clanNick: 'quan.hoangminh',
		prioritizeName: 'Quan Hoang Minh Quan Hoang Minh ',
	},
	{
		id: '1809069169707061248',
		name: 'anh.trantruong',
		avatarUser: 'https://lh3.googleusercontent.com/a/ACg8ocI8ca6jWlJSok17IQXxZ6epvD5VBrUDic-U0fsGO-JcsFRT-A=s96-c',
		displayName: 'Anh Tran Truong',
		lastSentTimeStamp: '0',
		idDM: '',
		type: 1,
		clanNick: 'anh.trantruong',
		prioritizeName: 'Anh Tran Truong',
	},
	{
		id: '1797900180415057920',
		name: 'thanhlamtainguyen',
		avatarUser: 'https://lh3.googleusercontent.com/a/ACg8ocKOouaIPcvyUopgl2wwJy-TV_BgMIFLfppbAoCG7iiOqzgKfMU3=s96-c',
		displayName: 'Sơn Tùng Nguyễn Quý',
		lastSentTimeStamp: '0',
		idDM: '',
		type: 1,
		clanNick: 'thanhlamtainguyen',
		prioritizeName: 'Sơn Tùng Nguyễn Quý',
	},
	{
		id: '1809615992091840512',
		name: 'boizbucky',
		avatarUser: 'https://lh3.googleusercontent.com/a/ACg8ocITZd01azn70ht72AfgDmdkSX8CUDS_A8m2dNAW4AJqtL45Zg=s96-c',
		displayName: 'Thích Du Yên',
		lastSentTimeStamp: '0',
		idDM: '',
		type: 1,
		clanNick: 'boizbucky',
		prioritizeName: 'Thích Du Yên',
	},
];
