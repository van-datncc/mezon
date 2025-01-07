import { selectMemberCustomStatusById, selectMemberStatusById, useAppSelector } from '@mezon/store';

export function useMemberStatus(memberId: string) {
	const memberStatus = useAppSelector((state) => selectMemberStatusById(state, memberId));

	return {
		status: memberStatus.status,
		isMobile: memberStatus.isMobile
	};
}

export function useMemberCustomStatus(memberId: string, isDM?: boolean) {
	const memberStatus = useAppSelector((state) => selectMemberCustomStatusById(state, memberId, isDM));
	return memberStatus;
}
