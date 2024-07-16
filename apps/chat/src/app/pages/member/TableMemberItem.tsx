import {useSelector} from "react-redux";
import {selectAllRolesClan, selectMemberByUserId, selectTheme} from "@mezon/store";
import {useMemo} from "react";
import {Tooltip} from "flowbite-react";
import RoleNameCard from "./RoleNameCard";

type TableMemberItemProps = {
  userId: string;
  username: string;
  avatar: string;
  clanJoinTime?: string;
  discordJoinTime?: string;
  displayName: string;
};

const TableMemberItem = ({ userId, username, avatar, clanJoinTime, discordJoinTime, displayName }: TableMemberItemProps) => {
  const userById = useSelector (selectMemberByUserId (userId ?? ''));
  const RolesClan = useSelector (selectAllRolesClan);
  const appearanceTheme = useSelector (selectTheme);
  const userRolesClan = useMemo (() => {
    return RolesClan.filter ((role) => {
      if (role.role_user_list?.role_users) {
        const list = role.role_user_list.role_users.filter (user => user.id === userId);
        return list.length;
      }
      return false;
    });
  }, [userById?.role_id, RolesClan]);
  
  return (
    <div className="flex flex-row justify-between items-center h-[48px] border-b-[1px] dark:border-borderDivider border-buttonLightTertiary last:border-b-0">
      <div className="flex-3 p-1">
        <div className="flex flex-row gap-2 items-center">
          <img src={avatar} alt={username} className="w-[36px] h-[36px] min-w-[36px] rounded-full object-cover"/>
          <div className="flex flex-col">
            <p className="text-base font-medium">{displayName}</p>
            <p className="text-[11px] dark:text-textDarkTheme text-textLightTheme">{username}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 p-1 text-center">
        <span className="text-xs dark:text-textDarkTheme text-textLightTheme font-bold uppercase">{clanJoinTime ?? '-'}</span>
      </div>
      <div className="flex-1 p-1 text-center">
        <span className="text-xs dark:text-textDarkTheme text-textLightTheme font-bold uppercase">{discordJoinTime + ' ago' ?? '-'}</span>
      </div>
      <div className="flex-1 p-1 text-center">
        {userRolesClan?.length ?
          <span className={'inline-flex items-center'}>
            <RoleNameCard roleName={userRolesClan[0]?.title || ''}/>
            {userRolesClan.length > 1 &&
              <span className="inline-flex gap-x-1 items-center text-xs rounded p-1 dark:bg-bgSecondary600 bg-slate-300 dark:text-contentTertiary text-colorTextLightMode hoverIconBlackImportant ml-1">
                <Tooltip
                  content={
                    <div className={'flex flex-col items-start'}>
                      {userRolesClan.slice(1).map ((role, id) => (
                        <div className={'my-0.5'}>
                          <RoleNameCard key={role.id} roleName={role.title || ''}/>
                        </div>
                      ))}
                    </div>
                  }
                  trigger={'hover'}
                  style={appearanceTheme === 'light' ? 'light' : 'dark'}
                  className='dark:!text-white !text-black'
                >
                  <span className='text-xs font-medium px-1 cursor-pointer' style={{lineHeight: '15px'}}>+{userRolesClan.length - 1}</span>
                </Tooltip>
              </span>
            }
          </span>
          : '-'}
      
      </div>
      <div className="flex-3 p-1 text-center">
        <span className="text-xs dark:text-textDarkTheme text-textLightTheme font-bold uppercase">Signals</span>
      </div>
    </div>
  );
};

export default TableMemberItem;
