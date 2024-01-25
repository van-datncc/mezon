import { useChat } from '@mezon/core';
import { MemberProfile } from '@mezon/components'
import { ChannelMembersEntity } from '@mezon/store';

export type MemberListProps = { className?: string };

function MemberList() {
  const { members } = useChat();
  return (
    <>
      <div className="self-stretch h-[268px] flex-col justify-start items-start flex p-[24px] pt-[16px] pr-[24px] pb-[16px] pl-[16px] gap-[24px]">
        {members.map((role: any) => (
          <div key={role.id}>
            {role.title && (
              <text
                className="font-['Manrope'] mb-3 text-[#AEAEAE] text-[14px] font-bold flex items-center gap-[4px] font-title text-xs tracking-wide uppercase"
              >
                {role.title}
              </text>
            )}
            {(
              <div className="flex flex-col gap-4 font-['Manrope'] text-[#AEAEAE]">
                {role?.users
                  .map((user: ChannelMembersEntity) => (
                    <MemberProfile
                      avatar={user?.user?.avatar_url ?? ''}
                      name={user?.user?.username ?? ''}
                      status={user.user?.online}
                      isHideStatus={false}
                      key={user.id}
                    />
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default MemberList;
