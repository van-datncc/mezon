import { selectCurrentClan } from '@mezon/store';
import { EPermission } from '@mezon/utils';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../auth/hooks/useAuth';
import { useUserRestriction } from './useUserRestriction';

export type ClanRestrictionReturnType = [boolean, { isClanCreator: boolean }];

export function useClanRestriction(restrictions: EPermission[]) :ClanRestrictionReturnType {
	const currentClan = useSelector(selectCurrentClan);
	const { userProfile } = useAuth();
	const isAllowed = useUserRestriction(restrictions)
	
	const isClanCreator = useMemo(() => {
		return currentClan?.creator_id === userProfile?.user?.id 
	}, [currentClan, userProfile]);
	
	return [isAllowed, {isClanCreator}] as ClanRestrictionReturnType;
}
