import {
	selectAllCategories,
} from '@mezon/store';
import { ICategoryChannel, IChannel } from '@mezon/utils';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useChannels } from './useChannels';

export function useCategory() {
	const { channels } = useChannels();	
	const categories = useSelector(selectAllCategories);

	const categorizedChannels = React.useMemo(() => {
		const results = categories.map((category) => {
			const categoryChannels = channels.filter((channel) => channel && channel?.category_id === category.id) as IChannel[];
			return {
				...category,
				channels: categoryChannels,
			};
		});

		return results as ICategoryChannel[];
	}, [channels, categories]);

	return useMemo(
		() => ({
			categorizedChannels,			
		}),
		[
			categorizedChannels,			
		],
	);
}
