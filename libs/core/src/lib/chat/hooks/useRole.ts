import { selectAllRolesClan } from '@mezon/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useRoles() {
	const RolesClan = useSelector(selectAllRolesClan);
	// const MembersRole = useSelector(selectAllMembersRole);
	return useMemo(
		() => ({
			RolesClan,
			// MembersRole,
		}),
		[
			RolesClan,
			// MembersRole,
		],
	);
}
