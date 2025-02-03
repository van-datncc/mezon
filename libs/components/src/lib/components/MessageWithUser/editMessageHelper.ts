import {
	EBacktickType,
	IMarkdownOnMessage,
	IMessageSendPayload,
	INewPosMarkdown,
	parseHtmlAsFormattedText,
	processMarkdownEntities
} from '@mezon/utils';

export const prepareProcessedContent = (processedContentDraft: IMessageSendPayload) => {
	const { text, entities } = parseHtmlAsFormattedText(processedContentDraft.t ?? '');
	const mk: IMarkdownOnMessage[] = processMarkdownEntities(text, entities);

	return {
		...processedContentDraft,
		t: text,
		mk
	};
};
// to get markdown will be add prefix include: code/pre/boldtext
export const getMarkdownPrefixItems = (draftContent: IMarkdownOnMessage[]) => {
	return (
		draftContent
			?.filter((item) => item.type === EBacktickType.PRE || item.type === EBacktickType.CODE || item.type === EBacktickType.BOLD)
			.sort((a, b) => (a.s ?? 0) - (b.s ?? 0)) ?? []
	);
};

// to add `/``` or ** to token markdown
export const addMarkdownPrefix = (markdownItems: IMarkdownOnMessage[], plaintext: string): INewPosMarkdown[] => {
	return markdownItems.map(({ type, s, e }) => {
		let value = plaintext?.slice(s, e);
		let markerNumber = 0;

		switch (type) {
			case EBacktickType.CODE: // Inline code
				value = `\`${value}\``;
				markerNumber = 2;
				break;
			case EBacktickType.PRE: // Code block
				value = `\`\`\`${value}\`\`\``;
				markerNumber = 6;
				break;
			case EBacktickType.BOLD: // Bold text
				value = `**${value}**`;
				markerNumber = 4;
				break;
		}

		return { type, value, s, e, markerNumber };
	});
};
// to calculator new position of token markdown after added frefix
export const updateMarkdownPositions = (prefixItems: INewPosMarkdown[]) => {
	let previousNe = 0;
	return prefixItems.map((item, index) => {
		let ns, ne;

		if (index === 0) {
			ns = item.s ?? 0;
			ne = (item.e ?? 0) + (item.markerNumber ?? 0);
		} else {
			ns = previousNe + ((item.s ?? 0) - (prefixItems[index - 1].e ?? 0));
			ne = ns + ((item.e ?? 0) - (item.s ?? 0)) + (item?.markerNumber ?? 0);
		}

		previousNe = ne;
		return { ...item, ns, ne };
	});
};

// get the new plaintext with token added prefix
export const generateNewPlaintext = (updatedItems: INewPosMarkdown[], plaintext: string) => {
	let newPlaintext = '';
	let lastIndex: number | undefined = 0;
	updatedItems?.forEach(({ value, s, e }) => {
		newPlaintext += plaintext && plaintext?.slice(lastIndex, s) + value;
		lastIndex = e;
	});

	newPlaintext += plaintext?.slice(lastIndex);

	return newPlaintext;
};
