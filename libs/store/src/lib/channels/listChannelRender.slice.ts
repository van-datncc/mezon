import { ICategoryChannel, IChannel } from '@mezon/utils';
import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { CategoriesEntity } from '../categories/categories.slice';
import { RootState } from '../store';

export const CHANNEL_LIST_RENDER = 'CHANNEL_LIST_RENDER';

export interface ChannelListRenderState {
	listChannelRender: Record<string, Array<IChannel | ICategoryChannel>>;
}

export const initialListChannelRenderState: ChannelListRenderState = {
	listChannelRender: {}
};

export interface DataChannelAndCate {
	listChannel: IChannel[];
	listCategory: CategoriesEntity[];
	clanId: string;
	listChannelFavor: string[];
}

export const listChannelRenderSlice = createSlice({
	name: CHANNEL_LIST_RENDER,
	initialState: initialListChannelRenderState,
	reducers: {
		mapListChannelRender: (state, action: PayloadAction<DataChannelAndCate>) => {
			const { listChannel, listCategory, clanId, listChannelFavor } = action.payload;
			if (!state.listChannelRender[clanId]) {
				const listChannelRender: (ICategoryChannel | IChannel)[] = [];
				const listFavorChannel: IChannel[] = [];
				listCategory.map((category) => {
					const categoryChannels = listChannel.filter((channel) => channel && channel.category_id === category.id) as IChannel[];
					const listChannelIds = categoryChannels.map((channel) => channel.id);
					const sortChannelList = sortChannels(categoryChannels);
					const categoryWithChannels: ICategoryChannel = {
						...category,
						channels: listChannelIds
					};

					listChannelRender.push(categoryWithChannels);
					sortChannelList.forEach((channel) => {
						if (listChannelFavor.includes(channel.id)) {
							listFavorChannel.push({
								...channel,
								isFavor: true,
								category_id : 'favorCate', 
								channel_id : `favor-${channel.id}`,
							});
						}
						listChannelRender.push(channel);
					});
				});
				const favorCate: ICategoryChannel = {
					channels: listChannelFavor,
					id: 'favorCate',
					category_id: 'favorCate',
					category_name: 'Favorite Channel',
					clan_id: clanId,
					creator_id: '0',
					category_order: 1
				};

				state.listChannelRender[clanId] = [favorCate, ...listFavorChannel, ...listChannelRender];
			}
		}
	}
});

export const listChannelRenderAction = {
	...listChannelRenderSlice.actions
};

export const listChannelRenderReducer = listChannelRenderSlice.reducer;

export const getListChannelRenderState = (rootState: { [CHANNEL_LIST_RENDER]: ChannelListRenderState }): ChannelListRenderState =>
	rootState[CHANNEL_LIST_RENDER];

export const selectListChannelRenderByClanId = createSelector(
	[getListChannelRenderState, (state: RootState, clanId?: string) => clanId],
	(state, clanId) => {
		if (!clanId || !state.listChannelRender[clanId]) {
			return undefined;
		}
		return state.listChannelRender[clanId];
	}
);

function sortChannels(channels: IChannel[]): IChannel[] {
	const channelMap = new Map<string, IChannel>();
	const sortedChannels: IChannel[] = [];

	// Create a map of channels by their id
	channels.forEach((channel) => {
		channelMap.set(channel.id, channel);
	});

	// Use forEach to sort channels
	channels.forEach((channel) => {
		if (!channel.parrent_id || channel.parrent_id === '0') {
			sortedChannels.push(channel);
			addChildren(channel, sortedChannels);
		}
	});

	function addChildren(parent: IChannel, acc: IChannel[]) {
		channels
			.filter((child) => child.parrent_id === parent.id)
			.forEach((child) => {
				acc.push(child);
				addChildren(child, acc);
			});
	}

	return sortedChannels;
}
