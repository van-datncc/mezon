
import { MentionData, defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import { useCallback, useState } from 'react';

export type MentionSuggestionWrapperProps = {
	listMentions?: MentionData[] | undefined;
	mentionPlugin: any;
}

function MentionSuggestionWrapper({ listMentions, mentionPlugin } : MentionSuggestionWrapperProps) {
	const [open, setOpen] = useState(false);
	
	const [suggestions, setSuggestions] = useState(listMentions);



	const { MentionSuggestions } = mentionPlugin;

	const onSearchChange = ({ value }: any) => {
		setSuggestions(defaultSuggestionsFilter(value, listMentions || []) as any);
	};

	const onOpenChange = useCallback((_open: boolean) => {
		setOpen(_open);
	}, []);

	return <MentionSuggestions onSearchChange={onSearchChange} onOpenChange={onOpenChange} open={open} suggestions={suggestions || []} />
}

export default MentionSuggestionWrapper;