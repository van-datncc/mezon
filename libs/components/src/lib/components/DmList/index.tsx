import { NavLink } from "react-router-dom";
import MemberProfile from "../MemberProfile";
import { IconFriends } from "../Icons";
import { useAppNavigation } from "@mezon/core";


export type ChannelListProps = { className?: string };
export type CategoriesState = Record<string, boolean>;

function DirectMessageList() {
    const { navigate } = useAppNavigation();

    // const { listDm } = useChatDirect();
    //Dummy data for list DirectMessages
    const listDm = [
        {
            user: {
                user_name: 'User1',
                avatar: '',
                description: 'Mezon member1'
            },
            dmId: 'a12345678user1'
        },
        {
            user: {
                user_name: 'User2',
                avatar: '',
                description: 'Mezon member1'
            },
            dmId: 'b23545677user2'
        }
    ]

    return (
        <>
            <hr className="h-[0.08px] w-[272px] mt-[24px] border-[#1E1E1E]" />
            <div className="overflow-y-scroll flex-1 pt-3 space-y-[21px] font-medium text-gray-300 scrollbar-hide ">
                {(
                    <div className="flex flex-col gap-4 font-['Manrope'] text-[#AEAEAE] p-4">
                        <button
                            className={` rounded-[4px] flex items-center gap-3`}
                            onClick={() => { navigate('/chat/direct/friends') }}
                        >
                            <IconFriends />
                            Add Friend
                        </button>
                        <span className="text-[14px] font-bold text-[#fff] mt-3">DIRECT MESSAGE</span>
                        {listDm
                            .map((directMessage: any) => (
                                <NavLink to={`/chat/direct/message/${directMessage.dmId}`}>
                                    <MemberProfile
                                        avatar={directMessage?.user?.avatar ?? ''}
                                        name={directMessage?.user?.user_name ?? ''}
                                        status={false}
                                        isHideStatus={false}
                                        key={directMessage.dmId}
                                    />
                                </NavLink>
                            ))}
                    </div>
                )}
            </div>
        </>
    );
}

{/* <NavLink to={`/chat/servers/${currentClan.id}`}>
                </NavLink> */}

export default DirectMessageList;
