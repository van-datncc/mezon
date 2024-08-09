import { IMessageSendPayload } from '@mezon/utils';

export const useFilteredContent = (content: IMessageSendPayload) => {
	const filterContent = (content: IMessageSendPayload) => {
		// Build the result object, excluding empty arrays and empty strings
		const result: Partial<IMessageSendPayload> = {};

		if (content?.t?.trim() !== '') {
			result.t = content.t;
		}
		if (content.ej && content.ej.length > 0) {
			result.ej = content.ej;
		}
		if (content.hg && content.hg.length > 0) {
			result.hg = content.hg;
		}
		if (content.lk && content.lk.length > 0) {
			result.lk = content.lk;
		}
		if (content.mk && content.mk.length > 0) {
			result.mk = content.mk;
		}

		if (content.vk && content.vk.length > 0) {
			result.vk = content.vk;
		}

		// Return undefined if the result is empty
		return Object.keys(result).length > 0 ? (result as IMessageSendPayload) : undefined;
	};

	return filterContent(content);
};
