import { Icons } from "@mezon/components"
import { ChannelMembersEntity, selectTheme } from "@mezon/store";
import { Tooltip } from "flowbite-react"
import { useSelector } from "react-redux";
import { OpenModalProps } from "..";
import { PopupAddFriend, PopupFriend, PopupOption } from "./PopupShortUser";

type GroupIconBannerProps = {
    checkAddFriend: boolean;
    openModal: OpenModalProps;
    user: ChannelMembersEntity | null;
    showPopupLeft?: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<OpenModalProps>>;
}

const GroupIconBanner = (props: GroupIconBannerProps) => {
    const {checkAddFriend, openModal, user, showPopupLeft, setOpenModal} = props;
	const appearanceTheme = useSelector(selectTheme);

    const handleDefault = (event: any) => {
        event.stopPropagation(); 
    }

    return(
        <>
            {checkAddFriend ? 
                <div className='p-2 rounded-full bg-[#000000b2] relative h-fit' onClick={(e) => {handleDefault(e);setOpenModal({openAddFriend: false, openOption: false, openFriend: !openModal.openFriend})}}>
                    <Tooltip
                        content='Friend'
                        trigger="hover"
                        animation="duration-500"
                        style={appearanceTheme === 'light' ? 'light' : 'dark'}
                        className="whitespace-nowrap"
                    >
                            <Icons.IconFriend className='iconWhiteImportant size-4'/>
                    </Tooltip>
                    {openModal.openFriend && <PopupFriend user={user} showPopupLeft={showPopupLeft}/>}
                </div>:
                <div className='p-2 rounded-full bg-[#000000b2] relative h-fit' onClick={(e) => {handleDefault(e);setOpenModal({openFriend: false, openOption: false, openAddFriend: !openModal.openAddFriend})}}>
                    <Tooltip
                        content='Add friend'
                        trigger="hover"
                        animation="duration-500"
                        style={appearanceTheme === 'light' ? 'light' : 'dark'}
                        className="whitespace-nowrap"
                    >
                            <Icons.AddPerson className='iconWhiteImportant size-4'/>
                    </Tooltip>
                    {openModal.openAddFriend && <PopupAddFriend user={user} showPopupLeft={showPopupLeft}/>}
                </div>
            }
            <div className='p-2 rounded-full bg-[#000000b2] relative h-fit' onClick={(e) => {handleDefault(e);setOpenModal(({openAddFriend: false, openFriend: false, openOption: !openModal.openOption}))}}>
                <Tooltip
                    content='More'
                    trigger="hover"
                    animation="duration-500"
                    style={appearanceTheme === 'light' ? 'light' : 'dark'}
                    className="whitespace-nowrap"
                >
                        <Icons.ThreeDot defaultSize='size-4 iconWhiteImportant'/>
                </Tooltip>
                {openModal.openOption && <PopupOption showPopupLeft={showPopupLeft}/>}
            </div>

        </>
    )
}

export default GroupIconBanner;