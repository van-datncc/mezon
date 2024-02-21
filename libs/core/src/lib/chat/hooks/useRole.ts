import { selectAllRolesClan ,selectAllMembersRole} from '@mezon/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { MembersRoleActions } from '../../../../../store/src/lib/getlistmemberinrole/getListMembersInRole.slice';

export function useRoles() {
	const RolesClan = useSelector(selectAllRolesClan);
	const MembersRole = useSelector(selectAllMembersRole);
	return useMemo(
		() => ({
			RolesClan,
			MembersRole,
		}),
		[
			RolesClan,
			MembersRole,
		],
	);
}
