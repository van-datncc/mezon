import { EPermission } from '@mezon/utils';
import React, { useEffect } from 'react';
import { useUserPolicy } from '../hooks/useUserPolicy';

type Props = {
	children: React.ReactNode;
	clanId: string;
};

type MezonPolicyValue = {
	permissionKeys: EPermission[];
};

export const MezonPolicy = React.createContext<MezonPolicyValue>({
	permissionKeys: [],
});

export function MezonPolicyProvider({ children, clanId }: Props) {
	const { permissionKeys, fetchPolicies } = useUserPolicy(clanId);

	// useEffect(() => {
	// 	fetchPolicies();
	// }, [permissionKeys, clanId, fetchPolicies]);

	const value = React.useMemo(() => ({ permissionKeys }), [permissionKeys]);

	return <MezonPolicy.Provider value={value}>{children}</MezonPolicy.Provider>;
}
