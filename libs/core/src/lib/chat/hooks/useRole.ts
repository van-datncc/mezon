import { rolesClanActions, selectAllRolesClan, useAppDispatch } from '@mezon/store';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useRoles() {
	const RolesClan = useSelector(selectAllRolesClan);

	const dispatch = useAppDispatch();
	const deleteRole = React.useCallback(
		async (roleId: string) => {
			await dispatch(rolesClanActions.fetchDeleteRole({ roleId }));
		},
		[dispatch],
	);

	const createRole = React.useCallback(
		async (clanId: string) => {
			await dispatch(rolesClanActions.fetchCreateRole({clanId}));
			await dispatch(rolesClanActions.fetchRolesClan({clanId}))
		},
		[dispatch],
	);

	const updateRole = React.useCallback(
		async (clanId:string, role_id: string, title: string, add_user_ids: string[], active_permission_ids: string[],
			remove_user_ids: string[], remove_permission_ids: string[]) => {
			await dispatch(rolesClanActions.fetchUpdateRole({role_id, title, add_user_ids,active_permission_ids, remove_user_ids, remove_permission_ids}))
			await dispatch(rolesClanActions.fetchRolesClan({clanId}))
		},
		[dispatch],
	);
	return useMemo(
		() => ({
			RolesClan,
			deleteRole,
			createRole,
			updateRole,
		}),
		[
			RolesClan,
			deleteRole,
			createRole,
			updateRole,
		],
	);
}
