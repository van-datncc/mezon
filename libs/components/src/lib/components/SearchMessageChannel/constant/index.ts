export const searchFieldName: Record<string, string> = {
	from: 'username',
	mentions: 'mention',
	has: 'has',
	before: 'before',
	after: 'after',
	in: 'channel_label',
	pinned: '',
	content: 'content',
	'>': 'username',
	'~': 'mention',
	'&': 'has'
};

export const searchOptions = [
	{ title: '>', content: 'user (from:)', value: 'username' },
	{ title: '~', content: 'user (mentions:)', value: 'mentions' },
	{ title: '&', content: 'link, embed or file (has:)', value: 'has' }
	// { title: 'before:', content: 'specific data', value: 'before' },
	// { title: 'after:', content: 'specific data', value: 'after' }
	// { title: 'during:', content: 'specific data', value: 'username' },
	// { title: 'after:', content: 'specific data', value: 'username' },
	// { title: 'pinned:', content: 'true or false', value: 'username' }
];

export const hasKeySearch = (value: string) => {
	return searchOptions.map((item) => item.title).some((fieldName) => value?.includes(fieldName));
};
