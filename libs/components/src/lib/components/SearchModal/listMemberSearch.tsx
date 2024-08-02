import SuggestItem from '../MessageBox/ReactionMentionInput/SuggestItem';

type ListMemberSearchProps = {
	listMemSearch: any;
	itemRef: React.MutableRefObject<HTMLDivElement | null>;
	searchText: string;
	idActive: string;
	handleSelectMem: (user: any) => Promise<void>;
	setIdActive: React.Dispatch<React.SetStateAction<string>>;
};

const ListMemberSearch = (props: ListMemberSearchProps) => {
	const { listMemSearch, itemRef, searchText, idActive, handleSelectMem, setIdActive } = props;

	return listMemSearch.length
		? listMemSearch
				.filter((item: any) => item.name.toUpperCase().indexOf(searchText.toUpperCase()) > -1)
				.slice(0, 7)
				.sort((a: any, b: any) => Number(b.lastSentTimeStamp) - Number(a.lastSentTimeStamp))
				.map((item: any) => {
					return (
						<div
							ref={itemRef}
							key={item.id}
							onClick={() => handleSelectMem(item)}
							onMouseEnter={() => setIdActive(item.id)}
							onMouseLeave={() => setIdActive(item.id)}
							className={`${idActive === item.id ? 'dark:bg-bgModifierHover bg-bgLightModeThird' : ''} dark:hover:bg-[#424549] hover:bg-bgLightModeButton w-full px-[10px] py-[4px] rounded-[6px] cursor-pointer`}
						>
							<SuggestItem
								name={item?.name}
								avatarUrl={item?.avatarUser}
								showAvatar
								displayName={item?.displayName || item.name}
								valueHightLight={searchText}
								subText={item?.name}
								wrapSuggestItemStyle='gap-x-1'
								subTextStyle='text-[13px]'
								clanNickname={item?.name}
							/>
						</div>
					);
				})
		: null;
};

export default ListMemberSearch;
