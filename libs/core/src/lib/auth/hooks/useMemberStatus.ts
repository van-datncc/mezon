import { selectMemberCustomStatusById, selectMemberOnlineStatusById, useAppSelector } from '@mezon/store';
import { useMemo } from 'react';
import { useAuth } from './useAuth';

export function useMemberStatus(memberId: string) {
	const memberStatus = useAppSelector((state) => selectMemberOnlineStatusById(state, memberId));
	const { userId } = useAuth();
	const status = useMemo(() => (userId === memberId ? true : memberStatus), [memberStatus, userId]);
	return status;
}

export function useMemberCustomStatus(memberId: string) {
	const memberStatus = useAppSelector((state) => selectMemberCustomStatusById(state, memberId));
	return memberStatus;
}
