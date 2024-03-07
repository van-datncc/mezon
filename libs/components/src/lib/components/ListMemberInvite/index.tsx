import { useDMInvite, useSendInviteMessage } from "@mezon/core";
import { useMezon } from "@mezon/transport";
import { ChangeEvent, useMemo, useState } from "react";
import ListMemberInviteItem from "./ListMemberInviteItem"
import { DirectEntity } from "@mezon/store";
export type ModalParam = {
    url:string;
    channelID?: string;
}
const ListMemberInvite = (props:ModalParam) => {
    
    const { listDMInvite } = useDMInvite(props.channelID);
    const [searchTerm, setSearchTerm] = useState('');
    const [sendIds, setSendIds] = useState<Record<string,boolean>>({});
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	  };
     
    const filteredListBySearch = useMemo(
		() => {
			return listDMInvite.filter(dmGroup => {
                return dmGroup.channel_lable?.toLowerCase().includes(searchTerm.toLowerCase());
            });
		},
		[listDMInvite,searchTerm],
	)
    const handleSend = (dmGroup : DirectEntity) => {
        setSendIds((ids)=>{
            return {
                ...ids, 
                [dmGroup.id]:true
            }
        })
    }
    
return(
    <>
        <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search..."
            className="w-full h-10 border border-solid border-black bg-black rounded-[5px] px-[10px]"
        />	
        <div className='py-[10px]'>
            {filteredListBySearch.map((dmGroup) => (
                <ListMemberInviteItem dmGroup = {dmGroup} url = {props.url} onSend={handleSend} isSent={!!(sendIds[dmGroup.id])}/>
            ))}
        </div>
        <hr className='border-solid border-borderDefault rounded-t '/>
    </>
)
}

export default ListMemberInvite