import { Checkbox } from "@mezon/ui";
import SuggestItem from "../MessageBox/ReactionMentionInput/SuggestItem";

type ListMemberSearchProps = {
    listMemSearch: any[];
    searchText: string;
    selectedObjectIdSends: any[];
    handleToggle: (id: string, type: number, clanId?: string, channel_label?: string) => void;
}

const ListMemberSearch = (props: ListMemberSearchProps) => {
    const {listMemSearch, searchText, selectedObjectIdSends, handleToggle} = props;
    return (
        listMemSearch.length
            && listMemSearch
                .filter((item: any) => item.name.toUpperCase().indexOf(searchText.toUpperCase()) > -1)
                .slice(0, 7)
                .sort((a: any, b: any) => Number(b.lastSentTimeStamp) - Number(a.lastSentTimeStamp))
                .map((item: any) => (
                    <div
                        key={item.id}
                        className="flex items-center px-4 py-1 dark:hover:bg-bgPrimary1 hover:bg-bgLightModeThird rounded"
                    >
                        <div className="flex-1 mr-1">
                            <SuggestItem
								name={item?.name}
								avatarUrl={item?.avatarUser}
								showAvatar
								displayName={item?.displayName || item.name}
								valueHightLight={searchText}
								subText={item?.name}
								wrapSuggestItemStyle='gap-x-1'
								subTextStyle='text-[13px]'
							/>
                        </div>
                        <Checkbox
                            className="w-4 h-4 focus:ring-transparent"
                            id={`checkbox-item-${item.idDM}`}
                            checked={selectedObjectIdSends.some((selectedItem: any) => selectedItem.id === item.idDM)}
                            onChange={() => handleToggle(item.idDM, item.typeChat || 0)}
                        />
                    </div>
                ))
    )
}

export default ListMemberSearch;