import { EPermission } from '@mezon/utils';
import { useMemo } from 'react';
import { useClans } from '../../chat/hooks/useClans';
import { useUserRestriction } from './useUserRestriction';
import { useAuth } from '../../auth/hooks/useAuth';

export type ClanRestrictionReturnType = [boolean, { isClanCreator: boolean }];

export function useClanRestriction(restrictions: EPermission[]) :ClanRestrictionReturnType {
	const { currentClan } = useClans();
	const { userProfile } = useAuth();
	const isAllowed = useUserRestriction(restrictions)
	
	const isClanCreator = useMemo(() => {
		return currentClan?.creator_id === userProfile?.user?.id 
	}, [currentClan, userProfile]);
	
	return [isAllowed, {isClanCreator}] as ClanRestrictionReturnType;
}
