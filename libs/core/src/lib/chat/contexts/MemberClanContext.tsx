import { selectAllUserClans } from '@mezon/store';
import { getNameForPrioritize, IUsersClan, normalizeString, UsersClanEntity } from '@mezon/utils';
import { createContext, useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

interface MemberContextType {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	filteredMembers: IUsersClan[];
	clanOwner: UsersClanEntity;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const useMemberContext = () => {
	const context = useContext(MemberContext);
	if (!context) {
		throw new Error('useMemberContext must be used within a MemberProvider');
	}
	return context;
};

export const MemberProvider = ({ children }: { children: React.ReactNode }) => {
	const [searchQuery, setSearchQuery] = useState('');
	const usersClan = useSelector(selectAllUserClans);
	const usersWithPrioritizeName = usersClan.map((member: IUsersClan) => ({
		...member,
		prioritizeName: getNameForPrioritize(member.clan_nick ?? '', member.user?.display_name ?? '', member.user?.username ?? '')
	}));

	const filteredMembers = useMemo(() => {
		const searchLowerCase = normalizeString(searchQuery).toLowerCase();

		const filtered = usersWithPrioritizeName.filter((member) => {
			const prioritizeNameMatch = normalizeString(member.prioritizeName ?? '')
				?.toLowerCase()
				.includes(searchLowerCase);
			const usernameMatch = member.user?.username?.toLowerCase().includes(searchLowerCase);

			return prioritizeNameMatch || usernameMatch;
		});

		return filtered.sort((a, b) => {
			const nameA = a.prioritizeName?.toLowerCase() || '';
			const nameB = b.prioritizeName?.toLowerCase() || '';
			return nameA.localeCompare(nameB);
		});
	}, [usersWithPrioritizeName, searchQuery]);

	const clanOwner = useMemo(() => {
		return usersClan[usersClan.length - 1];
	}, [usersClan.length]);

	return <MemberContext.Provider value={{ searchQuery, setSearchQuery, filteredMembers, clanOwner }}>{children}</MemberContext.Provider>;
};
