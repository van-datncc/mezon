import { useSendInviteMessage } from "@mezon/core";
import { DirectEntity } from "@mezon/store";
import { useMezon } from "@mezon/transport";
import { useEffect, useState } from "react";

type ItemPorp = {
    url: string
    dmGroup: DirectEntity
    isSent?: boolean
    onSend: (dmGroup: DirectEntity) => void
}
const ListMemberInviteItem = (props: ItemPorp) => {
    const { dmGroup,isSent, url, onSend } = props;
    const [isInviteSent, setIsInviteSent] = useState(isSent);
    const mezon = useMezon();
    const { sendInviteMessage } = useSendInviteMessage();
    const handleButtonClick = async (directParamId: string, type: number) => {
        setIsInviteSent(true);
		mezon.joinChatDirectMessage(directParamId, "", type);
		sendInviteMessage(url, directParamId);
        onSend(dmGroup)
    }
    useEffect (()=>{
        setIsInviteSent(isSent)
    },[isSent])
    return (
        <div key={dmGroup.channel_id} className="flex items-center justify-between py-[5px]">
                    {Array.isArray(dmGroup.channel_avatar) && dmGroup.channel_avatar.length > 1 ? (
                        <img src={`/assets/images/avatar-group.png`} alt="" className="w-[30px] rounded-full" />
                    ) : (
                        <img src={dmGroup.channel_avatar} alt="" className="w-[30px] rounded-full" />
                    )}
                    <p style={{ marginRight: 'auto' }} className='pl-[10px]'>{dmGroup.channel_lable}</p>
                    <button 
                        onClick={() => handleButtonClick(dmGroup.channel_id || '', dmGroup.type || 0)}
                        disabled={isInviteSent}   
                        className={isInviteSent ? "bg-gray-400 text-gray-700 cursor-not-allowed border border-solid border-gray-400 rounded-[5px] py-[5px] px-[10px]" : "bg-green-500 hover:bg-green-600 text-white border border-solid border-green-500 rounded-[5px] py-[5px] px-[10px]"} 
                    >
                        {isInviteSent ? 'Sent' : 'Invite'}
                    </button>
                </div>
    )
}
export default ListMemberInviteItem;