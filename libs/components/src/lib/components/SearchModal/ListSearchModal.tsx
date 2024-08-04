import { filterListByName, SearchItemProps, sortFilteredList, TypeSearch } from '@mezon/utils';
import { memo, useMemo } from 'react';
import SuggestItem from '../MessageBox/ReactionMentionInput/SuggestItem';

type ListSearchModalProps = {
	listSearch: SearchItemProps[];
	searchText: string;
	itemRef: React.MutableRefObject<HTMLDivElement | null>;
	idActive: string;
	handleSelect: (type: boolean, item: SearchItemProps) => Promise<void>;
	setIdActive: React.Dispatch<React.SetStateAction<string>>;
};

const ListSearchModal = (props: ListSearchModalProps) => {
	const { listSearch, itemRef, searchText, idActive, handleSelect, setIdActive } = props;
	const isSearchByUsername = useMemo(() => {
		return searchText.startsWith('@');
	}, [searchText]);

	const filteredList = useMemo(() => filterListByName(listSearch, searchText, isSearchByUsername), [listSearch, searchText, isSearchByUsername]);
	const sortedList = useMemo(() => sortFilteredList(filteredList, searchText, isSearchByUsername), [filteredList, searchText, isSearchByUsername]);

	return (
		sortedList.length > 0 &&
		sortedList.slice(0, 15).map((item: SearchItemProps) => {
			const isTypeChannel = item.type === TypeSearch.Channel_Type;
			return (
				<div
					ref={itemRef}
					key={item.id}
					onClick={() => handleSelect(isTypeChannel, item)}
					onMouseEnter={() => setIdActive(item.id ?? '')}
					onMouseLeave={() => setIdActive(item.id ?? '')}
					className={`${idActive === item.id ? 'dark:bg-bgModifierHover bg-bgLightModeThird' : ''} dark:hover:bg-[#424549] hover:bg-bgLightModeButton w-full px-[10px] py-[4px] rounded-[6px] cursor-pointer`}
				>
					{isTypeChannel ? (
						<SuggestItem
							display={item?.prioritizeName}
							symbol={item.icon}
							subText={item.subText}
							channelId={item.channelId}
							valueHightLight={searchText}
							subTextStyle="uppercase"
							isOpenSearchModal
						/>
					) : (
						<SuggestItem
							display={item?.prioritizeName}
							avatarUrl={item?.avatarUser}
							showAvatar
							valueHightLight={isSearchByUsername ? searchText.slice(1) : searchText}
							subText={item?.name}
							wrapSuggestItemStyle="gap-x-1"
							subTextStyle="text-[13px]"
							isHightLight={!isSearchByUsername}
						/>
					)}
				</div>
			);
		})
	);
};

export default memo(ListSearchModal);
