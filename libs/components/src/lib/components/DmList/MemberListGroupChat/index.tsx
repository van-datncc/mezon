import { Icons, MemberProfile } from '@mezon/components';
import { useAppParams } from '@mezon/core';
import { ChannelMembersEntity, selectMembersByChannelId } from '@mezon/store';
import { MemberProfileType } from '@mezon/utils';
import { useSelector } from 'react-redux';

export type MemberListProps = {
	className?: string;
	directMessageId: string | undefined;
	createId?: string | undefined;
};

function MemberListGroupChat({ directMessageId, createId }: MemberListProps) {
	const { directId } = useAppParams();
	const rawMembers = useSelector(selectMembersByChannelId(directId));
	return (
		<div className="self-stretch h-[268px] flex-col justify-start items-start flex p-[24px] pt-[16px] pr-[24px] pb-[16px] pl-[16px] gap-[24px]">
			<div>
				<p className="mb-3 text-[#AEAEAE] font-semibold flex items-center gap-[4px] font-title text-xs tracking-wide uppercase">MEMBER</p>
				{
					<div className="flex flex-col gap-4 text-[#AEAEAE]">
						{rawMembers.map((user: ChannelMembersEntity) => (
							<div className="flex items-center" key={user.id}>
								<MemberProfile
									numberCharacterCollapse={30}
									avatar={user?.user?.avatar_url ?? ''}
									name={user?.user?.username ?? ''}
									status={user?.user?.online}
									isHideStatus={true}
									listProfile={true}
									user={user}
									positionType={MemberProfileType.DM_MEMBER_GROUP}
								/>
								{createId === user.user?.id && <Icons.IconUserCreateDM className="size-[14px] text-[#E7A931]" />}
							</div>
						))}
					</div>
				}
			</div>
		</div>
	);
}

export default MemberListGroupChat;
