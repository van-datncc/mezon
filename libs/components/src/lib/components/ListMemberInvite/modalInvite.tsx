import { useEffect, useState } from "react";
import Modal from "../../../../../ui/src/lib/Modal";
import { useClans, useInvite } from "@mezon/core";
import ListMemberInvite from ".";

export type ModalParam = {
    onClose: () => void;
    open: boolean;
    // url:string;
    channelID: string;
    confirmButton?: () => void;
}

const ModalInvite = (props: ModalParam) => {
    const [urlInvite, setUrlInvite] = useState('');
    const { currentClanId } = useClans();
    const { createLinkInviteUser } = useInvite();

    const {
		onClose,
		confirmButton,

	} = props;

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
  title="Invite friends to KOMU"
  onClose={() => {
    props.onClose();
  }}
  showModal={props.open}
  confirmButton={() => handleCopyToClipboard(urlInvite)}
  titleConfirm="Copy"
  subTitleBox="Send invite link to a friend"
  classSubTitleBox="ml-[0px] mt-[16px]"
  borderBottomTitle="border-b "
>
  <div>
    <ListMemberInvite url={urlInvite} channelID={props.channelID} />
    <div className="relative ">
    <p className="pt-[20px] pb-[12px] text-[20px] mb-12px">
      <span>Or, send a server invite link to a friend</span>
    </p>
      <input
        type="text"
        className="w-full h-11 border border-solid border-black bg-black rounded-[5px] px-[16px] py-[13px] text-[14px] "
        value={urlInvite}
        readOnly
      />
      <button
        className="absolute right-0 bottom-0 mb-1 text-white font-semibold text-sm px-8 py-1.5 
        shadow hover:text-fuchsia-500 outline-none focus:outline-none ease-linear transition-all duration-150 
        bg-primary text-[16px] leading-6 rounded mr-[8px]"
        onClick={() => {
          handleCopyToClipboard(urlInvite); 
          onClose(); 
        }}
      >
        Copy
      </button>
    </div>
    <p className="pt-[20px] pb-[12px] text-[14px] mb-12px text-[#AEAEAE] ">
      <span>Your invite link expires in 7 days </span>
      <a href="" className="text-blue-300">Edit invite link.</a>
    </p>
  </div>
</Modal> 
    )
}
export default ModalInvite
