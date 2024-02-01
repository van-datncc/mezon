import {
    IconFriends,
    MemberProfile,
} from "@mezon/components";
import { useChatDirect } from "@mezon/core";
import { useState } from "react";
import { Friend } from "vendors/mezon-js/packages/mezon-js/dist";
import { InputField, Modal } from "@mezon/ui";
import {
    fetchListFriends,
    requestAddFriendParam,
    sendRequestAddFriend,
    useAppDispatch,
} from "@mezon/store";

export default function FriendsPage() {
    const { friends } = useChatDirect();
    const [openModalAddFriend, setOpenModalAddFriend] = useState(false);

    const [tabCurrent, setTabCurrent] = useState("online");
    const handleChangeTab = (valueTab: string) => {
        setTabCurrent(valueTab);
    };
    const tabData = [
        { title: "Online", value: "online" },
        { title: "All", value: "all" },
        { title: "Pending", value: "pending" },
        { title: "Block", value: "block" },
    ];

    const handleOpenRequestFriend = () => {
        setOpenModalAddFriend(true);
    };

    const [requestAddFriend, setRequestAddFriend] =
        useState<requestAddFriendParam>({
            usernames: [],
            ids: [],
        });

    const handleChange = (key: string, value: string) => {
        switch (key) {
            case "username":
                setRequestAddFriend({ ...requestAddFriend, usernames: [value] });
                break;
            case "id":
                setRequestAddFriend({ ...requestAddFriend, ids: [value] });
                break;
            default:
                return;
        }
    };

    const dispatch = useAppDispatch();

    const handleAddFriend = async () => {
        const response = await dispatch(sendRequestAddFriend(requestAddFriend));
        dispatch(fetchListFriends());
        setOpenModalAddFriend(false);
    };

    return (
        <>
            <div className="flex flex-col flex-1 shrink min-w-0 bg-bgSecondary h-[100%]">
                {/* <ChannelTopbar channel={undefined} /> */}
                <div className="flex min-w-0 gap-7 items-center bg-bgSecondary border-b-[#000] border-b-[1px] px-6 py-4 justify-start">
                    <div className="flex flex-row gap-2">
                        <IconFriends />
                        Friend
                    </div>
                    <div className="flex flex-row gap-4 border-l-[1px] pl-6 border-borderDefault">
                        {tabData.map((tab, index) => (
                            <button
                                className={`px-3 py-[6px] rounded-[4px] ${tabCurrent === tab.value ? "bg-[#151C2B]" : ""}`}
                                tabIndex={index}
                                onClick={() => handleChangeTab(tab.value)}
                            >
                                {tab.title}
                            </button>
                        ))}
                    </div>
                    <button
                        className={`px-3 py-[6px] rounded-[4px] bg-primary`}
                        onClick={handleOpenRequestFriend}
                    >
                        Add Friend
                    </button>
                </div>
                <div className="flex-1 flex w-full">
                    <div className="px-6 py-6 flex-1">
                        <div className="flex flex-col gap-4 font-['Manrope'] text-[#AEAEAE]">
                            {friends.map((friend: Friend) => (
                                <MemberProfile
                                    avatar={friend?.user?.avatar_url ?? ""}
                                    name={friend?.user?.username ?? ""}
                                    status={friend.user?.online}
                                    isHideStatus={false}
                                    key={friend.user?.id}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="w-[420px] bg-bgSurface lg:flex hidden"></div>
                </div>
            </div>
            <Modal
                showModal={openModalAddFriend}
                title="Add Friend"
                titleConfirm="Send"
                onClose={() => setOpenModalAddFriend(false)}
                confirmButton={handleAddFriend}
                disableButtonConfirm={false}
            >
                <div className="w-full min-w-[500px]">
                    <span className="font-[600]">User name</span>
                    <InputField
                        onChange={(e) => handleChange("username", e.target.value)}
                        type="text"
                        className="bg-bgSurface mb-2 mt-1"
                    />
                </div>
                <div className="w-full">
                    <span className="font-[600]">User id</span>
                    <InputField
                        onChange={(e) => handleChange("id", e.target.value)}
                        type="text"
                        className="bg-bgSurface mb-2 mt-1"
                    />
                </div>
            </Modal>
        </>
    );
}
