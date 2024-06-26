import { Icons } from "@mezon/components"
import { selectTheme } from "@mezon/store";
import { Tooltip } from "flowbite-react"
import { useSelector } from "react-redux";
import { OpenModalProps } from "..";
import { PopupAddFriend, PopupFriend, PopupOption } from "./PopupShortUser";

type GroupIconBannerProps = {
    checkAddFriend: boolean;
    openModal: OpenModalProps;
    setOpenModal: React.Dispatch<React.SetStateAction<OpenModalProps>>;
}

const GroupIconBanner = (props: GroupIconBannerProps) => {
    const {checkAddFriend, openModal, setOpenModal} = props;
	const appearanceTheme = useSelector(selectTheme);

    const handleDefault = (event: any) => {
        event.stopPropagation(); 
    }

    return(
        <>
            {checkAddFriend ? 
                <div className='p-2 rounded-full bg-black relative h-fit' onClick={(e) => {handleDefault(e);setOpenModal({openAddFriend: false, openOption: false, openFriend: !openModal.openFriend})}}>
                    <Tooltip
                        content='Friend'
                        trigger="hover"
                        animation="duration-500"
                        style={appearanceTheme === 'light' ? 'light' : 'dark'}
                    >
                            <Icons.IconFriend className='text-white size-4'/>
                    </Tooltip>
                    {openModal.openFriend && <PopupFriend/>}
                </div>:
                <div className='p-2 rounded-full bg-black relative h-fit' onClick={(e) => {handleDefault(e);setOpenModal({openFriend: false, openOption: false, openAddFriend: !openModal.openAddFriend})}}>
                    <Tooltip
                        content='Add friend'
                        trigger="hover"
                        animation="duration-500"
                        style={appearanceTheme === 'light' ? 'light' : 'dark'}
                    >
                            <Icons.AddPerson className='text-white size-4'/>
                    </Tooltip>
                    {openModal.openAddFriend && <PopupAddFriend/>}
                </div>
            }
            <div className='p-2 rounded-full bg-black relative h-fit' onClick={(e) => {handleDefault(e);setOpenModal(({openAddFriend: false, openFriend: false, openOption: !openModal.openOption}))}}>
                <Tooltip
                    content='More'
                    trigger="hover"
                    animation="duration-500"
                    style={appearanceTheme === 'light' ? 'light' : 'dark'}
                >
                        <Icons.ThreeDot defaultSize='size-4 text-white'/>
                </Tooltip>
                {openModal.openOption && <PopupOption/>}
            </div>

        </>
    )
}

export default GroupIconBanner;