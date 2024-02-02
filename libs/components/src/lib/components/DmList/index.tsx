import { NavLink } from "react-router-dom";
import MemberProfile from "../MemberProfile";
import { IconFriends } from "../Icons";
import { useAppNavigation } from "@mezon/core";
import * as Icons from "../Icons";
import { ModalCreateDM } from "./ModalCreateDmGroup/index";
import { useState } from "react";

export type ChannelListProps = { className?: string };
export type CategoriesState = Record<string, boolean>;

function DirectMessageList() {
    const { navigate } = useAppNavigation();

    // const { listDm } = useChatDirect();
    //Dummy data for list DirectMessages
    const listDm = [
        {
            user: {
                user_name: "User10; User 11; PNN; TLX",
                avatar: "",
                description: "Mezon member1",
            },
            dmId: "60f777dc-2422-48bc-af3f-2fbaefedeb1d",
            type: 3,
        },
        {
            user: {
                user_name: "Chat With User11",
                avatar: "",
                description: "Mezon member1",
            },
            dmId: "b2bbd97c-84ab-405e-8b29-ea10457d6462",
            type: 2,
        },
        // {
        //   user: {
        //     user_name: "Trường LX",
        //     avatar: "",
        //     description: "Mezon member1",
        //   },
        //   dmId: "842b743e-7dc5-479c-aba8-1f174dd4e621",
        // },
        //     {
        //   user: {
        //     user_name: "Phong NN",
        //     avatar: "",
        //     description: "Mezon member1",
        //   },
        //   dmId: "e7766349-0e0b-40c2-ad02-603a74d23735",
        // },
    ];
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const onClickOpenModal = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <hr className="h-[0.08px] w-[272px] mt-[24px] border-[#1E1E1E]" />
            <div className="overflow-y-scroll flex-1 pt-3 space-y-[21px] font-medium text-gray-300 scrollbar-hide ">
                {
                    <div className="flex flex-col gap-4 font-['Manrope'] text-[#AEAEAE] p-4">
                        <button
                            className={` rounded-[4px] flex items-center gap-3`}
                            onClick={() => {
                                navigate("/chat/direct/friends");
                            }}
                        >
                            <IconFriends />
                            Add Friend
                        </button>
                        <div className="text-[14px] font-bold text-[#fff] mt-3 flex flex-row items-center justify-center gap-3  h-5">
                            DIRECT MESSAGE
                            <button onClick={onClickOpenModal} className="cursor-pointer flex flex-row justify-end ml-0">
                                <Icons.Plus />
                            </button>
                            <ModalCreateDM onClose={onClickOpenModal} isOpen={isOpen} />
                        </div>
                        {listDm.map((directMessage: any) => (
                            <NavLink to={`/chat/direct/message/${directMessage.dmId}/${directMessage.type}`}>
                                <MemberProfile avatar={directMessage?.user?.avatar ?? ""} name={directMessage?.user?.user_name ?? ""} status={false} isHideStatus={false} key={directMessage.dmId} />
                            </NavLink>
                        ))}
                    </div>
                }
            </div>
        </>
    );
}

export default DirectMessageList;
