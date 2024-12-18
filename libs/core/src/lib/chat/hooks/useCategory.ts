import { categoriesActions, selectAllCategories, selectCategoryIdSortChannel, selectChannelThreads, useAppDispatch } from '@mezon/store';
import { ICategoryChannel, IChannel } from '@mezon/utils';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export function useCategory() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const categorizedChannels = useCategorizedChannels();
	const handleDeleteCategory = useCallback(
		async ({ category }: { category: ICategoryChannel }) => {
			const toChannelPage = (channelId: string, clanId: string) => {
				if (channelId) return `/chat/clans/${clanId}/channels/${channelId}`;
				return `/chat/clans/${clanId}`;
			};
			const toMembersPage = (clanId: string) => {
				return `/chat/clans/${clanId}/member-safety`;
			};
			await dispatch(
				categoriesActions.deleteCategory({
					clanId: category.clan_id as string,
					categoryId: category.id as string,
					categoryLabel: category.category_name as string
				})
			);
			const targetIndex = categorizedChannels.findIndex((obj) => obj.category_id === category.id);

			let channelNavId = '';
			if (targetIndex !== -1) {
				if (targetIndex === 0) {
					channelNavId = categorizedChannels[targetIndex + 1]?.channels[0]?.id;
					if (!channelNavId) {
						const clanPath = toMembersPage(category.clan_id ?? '');
						navigate(clanPath);
						return;
					}
				} else if (targetIndex === categorizedChannels.length - 1) {
					channelNavId = categorizedChannels[targetIndex - 1]?.channels[0]?.id;
				} else {
					channelNavId = categorizedChannels[targetIndex - 1]?.channels[0]?.id;
				}
			}

			if (channelNavId && category.clan_id) {
				const channelPath = toChannelPage(channelNavId ?? '', category.clan_id ?? '');
				navigate(channelPath);
				return;
			}
		},
		[categorizedChannels]
	);

	return useMemo(
		() => ({
			categorizedChannels,
			handleDeleteCategory
		}),
		[categorizedChannels, handleDeleteCategory]
	);
}

export function useCategorizedChannels() {
	const listChannels = useSelector(selectChannelThreads);
	const categories = useSelector(selectAllCategories);
	const categoryIdSortChannel = useSelector(selectCategoryIdSortChannel);

	const categorizedChannels = useMemo(() => {
		const results = categories.map((category) => {
			const categoryChannels = listChannels.filter((channel) => channel && channel?.category_id === category.id) as IChannel[];

			if (category.category_id && categoryIdSortChannel[category.category_id]) {
				categoryChannels.sort((a, b) => {
					if (a.channel_label && b.channel_label) {
						return b.channel_label.localeCompare(a.channel_label);
					}
					return 0;
				});
			}

			return {
				...category,
				channels: categoryChannels
			};
		});

		return results as ICategoryChannel[];
	}, [categories, listChannels, categoryIdSortChannel]);

	return categorizedChannels;
}
