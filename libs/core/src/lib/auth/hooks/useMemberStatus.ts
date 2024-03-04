import { useAuth } from '@mezon/core';
import { selectMemberOnlineStatusById } from '@mezon/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useMemberStatus(memberId: string) {
	const memberStatus = useSelector(selectMemberOnlineStatusById(memberId));
	const { userId } = useAuth();
	const status = useMemo(() => (userId === memberId ? true : memberStatus), [memberStatus, userId]);
	return status;
}
