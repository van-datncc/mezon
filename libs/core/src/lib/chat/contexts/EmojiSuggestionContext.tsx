import { ReactNode, createContext, useContext } from 'react';
import { useEmojiSuggestion } from '../hooks/useEmojiSuggestion';

type EmojiSuggestionContextType = ReturnType<typeof useEmojiSuggestion>;

const EmojiSuggestionContext = createContext<EmojiSuggestionContextType | undefined>(undefined);

interface EmojiSuggestionProviderProps {
	children: ReactNode;
	isMobile?: boolean;
}

export function EmojiSuggestionProvider({ children, isMobile = false }: EmojiSuggestionProviderProps) {
	const emojiSuggestionValue = useEmojiSuggestion({ isMobile });

	return <EmojiSuggestionContext.Provider value={emojiSuggestionValue}>{children}</EmojiSuggestionContext.Provider>;
}

export function useEmojiSuggestionContext() {
	const context = useContext(EmojiSuggestionContext);
	if (context === undefined) {
		throw new Error('useEmojiSuggestionContext must be used within a EmojiSuggestionProvider');
	}
	return context;
}
