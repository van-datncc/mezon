import { Checkbox } from "@mezon/ui";
import { TypeSearch } from "@mezon/utils";
import SuggestItem from "../MessageBox/ReactionMentionInput/SuggestItem";

type ListSearchForwardMessageProps = {
    listSearch: any[];
    searchText: string;
    selectedObjectIdSends: any[];
    handleToggle: (id: string, type: number, clanId?: string, channel_label?: string) => void;
}

const ListSearchForwardMessage = (props: ListSearchForwardMessageProps) => {
    const {listSearch, searchText, selectedObjectIdSends, handleToggle} = props;
    return (
        listSearch.length
            && listSearch
                .filter((item: any) => item.name.toUpperCase().indexOf(searchText.toUpperCase()) > -1)
                .sort((a: any, b: any) => Number(b.lastSentTimeStamp) - Number(a.lastSentTimeStamp))
                .slice(0, 15)
                .map((item: any) => {
                    const isTypeDm = item.typeSearch === TypeSearch.Dm_Type;
                    return <div
                        key={item.id}
                        className="flex items-center px-4 py-1 dark:hover:bg-bgPrimary1 hover:bg-bgLightModeThird rounded"
                    >
                        {isTypeDm ?
                            <ItemDm 
                                id={item.idDM}
                                avatar={item.avatarUser}
                                name={item.name}
                                displayName={item.displayName}
                                searchText={searchText}
                                checked={selectedObjectIdSends.some((selectedItem: any) => selectedItem.id === item.idDM)}
                                handleToggle={() => handleToggle(item.idDM, item.typeChat || 0)}
                            />
                            :
                            <ItemChannel 
                                id={item.id}
                                name={item.name}
                                subText={item.subText}
                                searchText={searchText}
                                checked={selectedObjectIdSends.some((selectedItem: any) => selectedItem.id === item.id)}
                                handleToggle={() => handleToggle(item.id, item.type || 0, item.clanId, item.channel_label || '')}
                            />
                        }
                    </div>
                }
            ))
}

export default ListSearchForwardMessage;

type ItemDmProps = {
    id: string;
    name: string;
    avatar: string;
    displayName: string;
    searchText: string;
    checked: boolean;
    handleToggle: () => void;
}

const ItemDm = (props: ItemDmProps) => {
    const {id, name, avatar, displayName, searchText, checked, handleToggle} = props;
    return (
        <>
            <div className="flex-1 mr-1">
                <SuggestItem
                    name={name}
                    avatarUrl={avatar}
                    showAvatar
                    displayName={displayName || name}
                    valueHightLight={searchText}
                    subText={name}
                    wrapSuggestItemStyle='gap-x-1'
                    subTextStyle='text-[13px]'
                />
            </div>
            <Checkbox
                className="w-4 h-4 focus:ring-transparent"
                id={`checkbox-item-${id}`}
                checked={checked}
                onChange={handleToggle}
            />
        </>
    )
}

type ItemChannelProps = {
    id: string;
    name: string;
    subText: string;
    searchText: string;
    checked: boolean;
    handleToggle: () => void;
}

const ItemChannel = (props: ItemChannelProps) => {
    const {id, name, subText, searchText, checked, handleToggle} = props; 
    return (
        <>
            <div className="flex-1 mr-1">
                <SuggestItem
                    name={name}
                    displayName={name}
                    subText={subText}
                    channelId={id}
                    valueHightLight={searchText}
                    subTextStyle='uppercase'
                    isOpenSearchModal
                />
            </div>
            <Checkbox
                className="w-4 h-4 focus:ring-transparent"
                id={`checkbox-item-${id}`}
                checked={checked}
                onChange={handleToggle}
            />
        </>
    )
}