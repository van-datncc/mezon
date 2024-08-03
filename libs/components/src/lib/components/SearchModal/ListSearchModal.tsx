import { TypeSearch } from '@mezon/utils';
import SuggestItem from '../MessageBox/ReactionMentionInput/SuggestItem';

type ListSearchModalProps = {
	listSearch: any;
	searchText: string;
	itemRef: React.MutableRefObject<HTMLDivElement | null>;
	idActive: string;
	handleSelect: (type: boolean, item: any) => Promise<void>;
	setIdActive: React.Dispatch<React.SetStateAction<string>>;
};

const ListSearchModal = (props: ListSearchModalProps) => {
	const { listSearch, itemRef, searchText, idActive, handleSelect, setIdActive } = props;
	return (
		listSearch.length &&
		listSearch
			.filter((item: any) => item.name.toUpperCase().indexOf(searchText.toUpperCase()) > -1)
			.sort((a: any, b: any) => b.lastSentTimeStamp - a.lastSentTimeStamp)
			.slice(0, 15)
			.map((item: any) => {
				const isTypeChannel = item.type === TypeSearch.Channel_Type;
				return (
					<div
						ref={itemRef}
						key={item.id}
						onClick={() => handleSelect(isTypeChannel, item)}
						onMouseEnter={() => setIdActive(item.id)}
						onMouseLeave={() => setIdActive(item.id)}
						className={`${idActive === item.id ? 'dark:bg-bgModifierHover bg-bgLightModeThird' : ''} dark:hover:bg-[#424549] hover:bg-bgLightModeButton w-full px-[10px] py-[4px] rounded-[6px] cursor-pointer`}
					>
						{isTypeChannel ? (
							<SuggestItem
								username={item.name}
								displayName={item.name}
								symbol={item.icon}
								subText={item.subText}
								channelId={item.channelId}
								valueHightLight={searchText}
								subTextStyle="uppercase"
								isOpenSearchModal
							/>
						) : (
							<SuggestItem
								username={item?.name}
								avatarUrl={item?.avatarUser}
								showAvatar
								displayName={item?.displayName || item.name}
								valueHightLight={searchText}
								subText={item?.name}
								wrapSuggestItemStyle="gap-x-1"
								subTextStyle="text-[13px]"
								clanNickname={item?.name}
							/>
						)}
					</div>
				);
			})
	);
};

export default ListSearchModal;
