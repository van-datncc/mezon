import { EPermission } from '@mezon/utils';
import { useUserRestriction } from '../hooks/useUserRestriction';

export type UserRestrictionZoneProps = {
	permissions: EPermission[];
	policy?: boolean | undefined | null;
	children: React.ReactNode;
	render?: (children: React.ReactNode, isAllowed: boolean) => React.ReactNode;
};

export function UserRestrictionZone({ policy, permissions, render, children }: UserRestrictionZoneProps) {
	const isPermissionsAllowed = useUserRestriction(permissions);
	const isPolicyAllowed = typeof policy === 'boolean' ? policy : true;
	const isAllowed = isPermissionsAllowed && isPolicyAllowed;
	console.log('isAllowed: ', isPolicyAllowed, isPermissionsAllowed, isAllowed);
	const renderChildren = render ? render : (children: React.ReactNode, isAllowed: boolean) => (isAllowed ? children : null);

	return renderChildren(children, isAllowed);
}
