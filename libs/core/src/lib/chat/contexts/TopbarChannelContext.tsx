import { createContext, useContext, useState } from 'react';

interface TopbarChannelContextType {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
}

const TopbarContext = createContext<TopbarChannelContextType | undefined>(undefined);

export const useTopbarContext = () => {
	const context = useContext(TopbarContext);
	if (!context) {
		throw new Error('useMemberContext must be used within a MemberProvider');
	}
	return context;
};

export const TopbarContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [searchQuery, setSearchQuery] = useState('');

	return <TopbarContext.Provider value={{ searchQuery, setSearchQuery }}>{children}</TopbarContext.Provider>;
};
