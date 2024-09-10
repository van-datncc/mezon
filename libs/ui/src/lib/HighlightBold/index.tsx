import { normalizeString } from '@mezon/utils';

const HighlightMatchBold = (name: string, getUserName: string) => {
	const normalizedSearchName = normalizeString(getUserName);
	const normalizedItemName = normalizeString(name);

	const index = normalizedItemName.indexOf(normalizedSearchName);
	if (index === -1) {
		return name;
	}

	const beforeMatch = name.slice(0, index);
	const match = name.slice(index, index + getUserName.length);
	const afterMatch = name.slice(index + getUserName.length);
	return (
		<>
			{beforeMatch}
			<span className="font-bold">{match}</span>
			{afterMatch}
		</>
	);
};

export default HighlightMatchBold;
