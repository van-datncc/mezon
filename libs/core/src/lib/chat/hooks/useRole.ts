import { RolesClanActions, selectAllRolesClan, useAppDispatch } from '@mezon/store';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useRoles() {
	const RolesClan = useSelector(selectAllRolesClan);
	const dispatch = useAppDispatch();
	const deleteRole = React.useCallback(
		async (roleId: string) => {
			await dispatch(RolesClanActions.fetchDeleteRole({ roleId }));
		},
		[dispatch],
	);
	return useMemo(
		() => ({
			RolesClan,
			deleteRole,
		}),
		[
			RolesClan,
			deleteRole,
		],
	);
}
