import { useSelector } from "react-redux";
import { selectMembersByChannelId, ChannelMembersEntity } from "@mezon/store";
import { useMemo } from "react";

export type useChannelMembersOptions = {
    channelId?: string | null;
}

export function useChannelMembers({ channelId }: useChannelMembersOptions = {}) {
    const rawMembers = useSelector(selectMembersByChannelId(channelId));

    const members = useMemo(() => {
        if (!rawMembers) {
            return [];
        }

        const roles = [{
            id: 'db7be5e6-2a04-4c7a-9040-1ea1f7002f14',
            title: 'MEMBER'
        }]

        return roles.map((role) => {
            const categoryChannels = rawMembers.
            filter(
            //   (member) => member && member?.role_id === role.id
            (member) => member
            ) as ChannelMembersEntity[];
            return {
              ...role,
              users: categoryChannels,
            };
          });
    }, [rawMembers]);


    
    return {
        members
    };
}