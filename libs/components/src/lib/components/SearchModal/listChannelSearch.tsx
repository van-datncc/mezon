import { SuggestItem } from "../../components";

type ListChannelSearchProps = {
    listChannelSearch: any;
    searchText: string;
    itemRef: React.MutableRefObject<HTMLDivElement | null>;
    idActive: string;
    handleSelectChannel: (channel: any) => Promise<void>;
    setIdActive: React.Dispatch<React.SetStateAction<string>>;
}

const ListChannelSearch = (props: ListChannelSearchProps) => {
    const {listChannelSearch, itemRef, searchText, idActive, handleSelectChannel, setIdActive} = props;
    return (
        listChannelSearch.length
            && listChannelSearch
                .filter((item: any) => item.name.toUpperCase().indexOf(searchText.toUpperCase()) > -1)
                .slice(0, 8)
                .sort((a: any, b: any) => b.lastSentTimeStamp - a.lastSentTimeStamp)
                .map((item: any) => {
                    return (
                        <div
                            ref={itemRef}
                            key={item.id}
                            onClick={() => handleSelectChannel(item)}
                            onMouseEnter={() => setIdActive(item.id)}
                            onMouseLeave={() => setIdActive(item.id)}
                            className={`${idActive === item.id ? 'dark:bg-bgModifierHover bg-bgLightModeThird' : ''} dark:hover:bg-[#424549] hover:bg-bgLightModeButton w-full px-[10px] py-[4px] rounded-[6px] cursor-pointer`}
                        >
                            <SuggestItem
                                name={item.name}
                                displayName={item.name}
                                symbol={item.icon}
                                subText={item.subText}
                                channelId={item.channelId}
                                valueHightLight={searchText}
                                subTextStyle='uppercase'
                                isOpenSearchModal
                            />
                        </div>
                    );
                })
        
    )
}

export default ListChannelSearch;