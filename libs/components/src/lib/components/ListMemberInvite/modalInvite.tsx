import { useEffect, useState } from "react";
import Modal from "../../../../../ui/src/lib/Modal";
import { useClans, useInvite } from "@mezon/core";
import ListMemberInvite from ".";

export type ModalParam = {
    onClose: () => void;
    open: boolean;
    // url:string;
    channelID: string;
    
}

const ModalInvite = (props: ModalParam) => {
    console.log("props.channelID: ", props.channelID);
    const [urlInvite, setUrlInvite] = useState('');
    const { currentClanId } = useClans();
    const { createLinkInviteUser } = useInvite();
console.log("currentClanId: ", currentClanId);

    const handleOpenInvite = () => {
        createLinkInviteUser(currentClanId ?? '', props.channelID ?? '' , 10).then((res) => {
            if (res && res.invite_link) {
                setUrlInvite(window.location.origin + '/invite/' + res.invite_link);
            }
        });
    };
    
    useEffect(() => {
        handleOpenInvite();
	}, []);

    const unsecuredCopyToClipboard = (text: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Unable to copy to clipboard', err);
        }
        document.body.removeChild(textArea);
    };
    
    const handleCopyToClipboard = (content: string) => {
        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(content);
        } else {
            unsecuredCopyToClipboard(content);
        }
    };
    return(
        <Modal
				title="Invite friend"
				onClose={() => {
					props.onClose();
				}}
				showModal={props.open}
				confirmButton={() => handleCopyToClipboard(urlInvite)}
				titleConfirm="Copy"
				subTitleBox="Send invite link to a friend"
				classSubTitleBox="ml-[-5px]"
				borderBottomTitle="border-b "
			>
				<div>
					<ListMemberInvite url={urlInvite} channelID = {props.channelID} />
					<p className='pt-[10px]'>
						<span>{urlInvite}</span>
					</p>
				</div>
			</Modal> 
    )
}
export default ModalInvite
