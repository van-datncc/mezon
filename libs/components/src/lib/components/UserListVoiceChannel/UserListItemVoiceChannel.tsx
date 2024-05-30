import { selectChannelById, selectMemberByDisplayName, selectMembersByChannelId } from '@mezon/store';
import { AvatarComponent, NameComponent } from '@mezon/ui';
import { IChannelMember } from '@mezon/utils';
import { useSelector } from 'react-redux';

function UserListItem({user, channelID}: {user: IChannelMember, channelID: string}){
    const member = useSelector(selectMemberByDisplayName(user.participant ||''));
    console.log(member);

    return(
        <div className="dark:hover:bg-[#36373D] hover:bg-bgLightModeButton w-[90%] flex p-1 ml-5 items-center gap-3 cursor-pointer rounded-sm">
            <div className="w-5 h-5 rounded-full scale-75">
                <div className="w-8 h-8 mt-[-0.3rem]">
                    <AvatarComponent id='' url={member?.user?.avatar_url || ''}/>
                </div>
            </div>
            <div>
                <NameComponent id='' name={member?.user?.username|| ''}/>
            </div>
        </div>
    )
}

export default UserListItem;