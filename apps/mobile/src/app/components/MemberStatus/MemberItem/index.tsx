import { useMemberStatus } from "@mezon/core";
import { ChannelMembersEntity } from "@mezon/store-mobile";
import MemberProfile from "../MemberProfile";

interface IProps {
    user: ChannelMembersEntity;
    listProfile?: boolean;
    isOffline?: boolean;
}

export default function MemberItem({ user, isOffline }: IProps) {
    const userStatus = useMemberStatus(user.user?.id || '');
    return (
        <MemberProfile
            user={user}
            status={userStatus}
            numCharCollapse={30}
            isHideIconStatus={userStatus ? false : true}
            isOffline={isOffline}
        />
    )
}