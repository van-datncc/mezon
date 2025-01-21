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
		async ({ category, currenChannel }: { category: ICategoryChannel; currenChannel: IChannel }) => {
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
			if (currenChannel.category_id === category.category_id) {
				const linkPageMember = toMembersPage(category.clan_id || '');
				navigate(linkPageMember);
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
		const listChannelRender: (ICategoryChannel | IChannel)[] = [];
		categories.map((category) => {
			const categoryChannels = listChannels.filter((channel) => channel && channel.category_id === category.id) as IChannel[];
			const listChannelIds = categoryChannels.map((channel) => channel.id);

			const categoryWithChannels: ICategoryChannel = {
				...category,
				channels: listChannelIds
			};

			listChannelRender.push(categoryWithChannels);
			categoryChannels.forEach((channel) => listChannelRender.push(channel));
		});

		return listChannelRender;
	}, [categories, listChannels, categoryIdSortChannel]);

	return categorizedChannels;
}
