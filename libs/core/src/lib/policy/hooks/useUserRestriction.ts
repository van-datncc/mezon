import { EPermission } from '@mezon/utils';
import { useMemo } from 'react';
import { useClans } from '../../chat/hooks/useClans';
import { useUserPolicy } from './useUserPolicy';

export function useUserRestriction(restrictions: EPermission[]) {
	const { currentClanId } = useClans();
	const { permissionKeys } = useUserPolicy(currentClanId || '');

	const isAllowed = useMemo(() => {
		return restrictions.every((restriction) => permissionKeys.includes(restriction));
	}, [permissionKeys, restrictions]);

	return isAllowed;
}
