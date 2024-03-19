import { useDMInvite } from "@mezon/core";
import { ChangeEvent, useMemo, useState } from "react";
import ListMemberInviteItem from "./ListMemberInviteItem"
import { DirectEntity } from "@mezon/store";
export type ModalParam = {
    url:string;
    channelID?: string;
}
const ListMemberInvite = (props:ModalParam) => {
    const { listDMInvite, listUserInvite } = useDMInvite(props.channelID);
    const [searchTerm, setSearchTerm] = useState('');
    const [sendIds, setSendIds] = useState<Record<string,boolean>>({});
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	  };

    const filteredListDMBySearch = useMemo(
		() => {
			return listDMInvite?.filter(dmGroup => {
                return dmGroup.channel_label?.toLowerCase().includes(searchTerm.toLowerCase());
            });
		},
		[listDMInvite,searchTerm],
	);

    const filteredListUserBySearch = useMemo(
        () => {
			return listUserInvite?.filter(dmGroup => {
                return dmGroup.user?.display_name?.toLowerCase().includes(searchTerm.toLowerCase());
            });
		},
		[listUserInvite,searchTerm],
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
            className="w-full h-10 border border-solid border-black bg-black rounded-[5px] px-[16px] py-[13px] text-[14px]"
        />	
        <p className="ml-[0px] mt-[16px] mb-[16px] text-[#AEAEAE] text-[16px]">This channel is private, only select members and roles can view this channel.</p>
        <hr className="border-solid border-borderDefault rounded-t "></hr>
        <div className='py-[10px]'>
            {listDMInvite ? (
                <div>
                    {filteredListDMBySearch?.map((dmGroup) => (
                        <ListMemberInviteItem dmGroup = {dmGroup} key={dmGroup.id} url = {props.url} onSend={handleSend} isSent={!!(sendIds[dmGroup.id])}/>
                    ))} 
                </div>
            ):(
                <div>
                    {filteredListUserBySearch?.map((user) => (
                        <ListMemberInviteItem user = {user} key={user.id} url = {props.url} onSend={handleSend} isSent={!!(sendIds[user.id])}/>
                    ))}
                </div>
            )}
        </div>
        <hr className='border-solid border-borderDefault rounded-t '/>
    </>
)
}

export default ListMemberInvite