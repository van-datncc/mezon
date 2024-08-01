import { Checkbox } from "@mezon/ui";
import { SuggestItem } from "../../components";

type ListChannelSearchProps = {
    listChannelSearch: any[];
    searchText: string;
    selectedObjectIdSends: any[];
    handleToggle: (id: string, type: number, clanId?: string, channel_label?: string) => void;
}

const ListChannelSearch = (props: ListChannelSearchProps) => {
    const {listChannelSearch, searchText, selectedObjectIdSends, handleToggle} = props;
    console.log("🚀 ~ ListChannelSearch ~ listChannelSearch:", listChannelSearch)
    return (
        listChannelSearch.length
            && listChannelSearch
                .filter((item) => item.name.toUpperCase().indexOf(searchText.toUpperCase()) > -1)
                .slice(0, 8)
                .sort((a: any, b: any) => Number(b.lastSentTimeStamp) - Number(a.lastSentTimeStamp))
                .map((channel: any) => {
                    return (
                        <div
                            key={channel.id}
                            className="flex items-center px-4 py-1 dark:hover:bg-bgPrimary1 hover:bg-bgLightModeThird rounded"
                        >
                            <div className="flex-1 mr-1">
                                <SuggestItem
                                    name={channel.name ?? ''}
                                    displayName={channel.name}
                                    symbol={channel.icon}
                                    subText={channel.subText}
                                    channelId={channel.id}
                                    valueHightLight={searchText}
                                />
                            </div>
                            <Checkbox
                                className="w-4 h-4 focus:ring-transparent"
                                id={`checkbox-item-${channel.id}`}
                                checked={selectedObjectIdSends.some(
                                    (selectedItem: any) => selectedItem.id === channel.id,
                                )}
                                onChange={() =>
                                    handleToggle(
                                        channel.id,
                                        channel.type || 0,
                                        channel.clanId,
                                        channel.channel_label || '',
                                    )
                                }
                            />
                        </div>
                    );
                })
    )
}

           
export default ListChannelSearch;