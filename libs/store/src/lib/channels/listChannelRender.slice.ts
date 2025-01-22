import { ICategoryChannel, IChannel } from '@mezon/utils';
import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { CategoriesEntity } from '@mezon/store';

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
      const listChannelRender: (ICategoryChannel | IChannel)[] = [];
      listCategory.map((category) => {
        const categoryChannels = listChannel.filter((channel) => channel && channel.category_id === category.id) as IChannel[];
        const listChannelIds = categoryChannels.map((channel) => channel.id);
  
        const categoryWithChannels: ICategoryChannel = {
          ...category,
          channels: listChannelIds
        };
  
        listChannelRender.push(categoryWithChannels);
        categoryChannels.forEach((channel) => listChannelRender.push(channel));
      });
      state.listChannelRender[clanId] = listChannelRender;
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
