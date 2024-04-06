import { IGif } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

export const GIFS_FEATURE_KEY = 'gifs';

export interface GifsEntity extends IGif {
	id: string;
}

export const gifsAdapter = createEntityAdapter<GifsEntity>();

export interface GifsState extends EntityState<GifsEntity, string> {
	loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
	error?: string | null;
	gifsData?: any;
}
export const initialGifsState: GifsState = {
	...gifsAdapter.getInitialState(),
	loadingStatus: 'not loaded',
	error: null,
};

export const fetchGifsData = createAsyncThunk<any>('gifs/fetchStatus', async (_, thunkAPI) => {
	try {
		const response = await fetch(`${process.env.NX_CHAT_APP_API_GIPHY_TRENDING}?api_key=${process.env.NX_CHAT_APP_API_GIPHY_KEY}&limit=${30}`);
		if (!response.ok) {
			throw new Error('Failed to fetch gifs data');
		}
		const data = await response.json();
		console.log(data.data);
		return data;
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});

export const gifsSlice = createSlice({
	name: GIFS_FEATURE_KEY,
	initialState: initialGifsState,
	reducers: {
		add: gifsAdapter.addOne,
		remove: gifsAdapter.removeOne,
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchGifsData.pending, (state: GifsState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchGifsData.fulfilled, (state: GifsState, action: PayloadAction<GifsEntity[]>) => {
				gifsAdapter.setAll(state, action.payload);
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchGifsData.rejected, (state: GifsState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	},
});

export const gifsReducer = gifsSlice.reducer;

export const gifsActions = {
	...gifsSlice.actions,
	fetchGifsData,
};

const { selectAll, selectEntities } = gifsAdapter.getSelectors();

export const getGifsState = (rootState: { [GIFS_FEATURE_KEY]: GifsState }): GifsState => rootState[GIFS_FEATURE_KEY];

export const selectAllgifs = createSelector(getGifsState, selectAll);

export const selectGifsEntities = createSelector(getGifsState, selectEntities);
