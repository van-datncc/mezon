import TableMemberHeader from './TableMemberHeader';
import TableMemberItem from './TableMemberItem';
import {useSelector} from 'react-redux';
import {selectAllUsesClan} from '@mezon/store';
import {getTimeDifferenceDate} from "@mezon/utils";

const TableMember = () => {
  const usersClan = useSelector (selectAllUsesClan);
  
  return (
    <div className="flex flex-col flex-1 min-h-[48px]">
      <TableMemberHeader/>
      <div className="flex flex-col overflow-y-auto px-4 py-2 shadow border-b-[1px] dark:border-bgTertiary">
        {usersClan.map ((user) => (
          <TableMemberItem
            key={user.id}
            name={user.user?.username ?? ''}
            avatar={user.user?.avatar_url ?? ''}
            discordJoinTime={getTimeDifferenceDate (user.user?.create_time || '')}
            clanJoinTime={user.user?.join_time}
            userId={user.id}
          />
        ))}
      </div>
    </div>
  );
};

export default TableMember;
