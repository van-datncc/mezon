import { IGif } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

export const GIFS_FEATURE_KEY = 'gifs';

export interface GifsEntity extends IGif {
	id:string
}

export const gifsAdapter = createEntityAdapter<GifsEntity>();

export interface GifsState extends EntityState<GifsEntity, string> {
	loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
	error?: string | null;
	dataGifsSearch: IGif[];
	valueInputToCheckHandleSearchState?:string
}
export const initialGifsState: GifsState = {
	...gifsAdapter.getInitialState(),
	loadingStatus: 'not loaded',
	error: null,
	dataGifsSearch: [],
	valueInputToCheckHandleSearchState: ''
};

export const fetchGifsData = createAsyncThunk<any>('gifs/fetchStatus', async (_, thunkAPI) => {
	try {
		const response = await fetch(`${process.env.NX_CHAT_APP_API_GIPHY_TRENDING}?api_key=${process.env.NX_CHAT_APP_API_GIPHY_KEY}&limit=${10}`);
		if (!response.ok) {
			throw new Error('Failed to fetch gifs data');
		}
		const data = await response.json();
		return data.data;
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
		setValueInputSearch: (state, action)=>{
			state.valueInputToCheckHandleSearchState = action.payload
		}
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
		builder
			.addCase(fetchGifsDataSearch.pending, (state: GifsState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchGifsDataSearch.fulfilled, (state: GifsState, action: PayloadAction<GifsEntity[]>) => {
				state.dataGifsSearch = action.payload;
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchGifsDataSearch.rejected, (state: GifsState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	},
});

type FetchGifsDataSearchPayload = any;
export const fetchGifsDataSearch = createAsyncThunk<FetchGifsDataSearchPayload, string>('gifs/fetchDataSearch', async (valueSearch, thunkAPI) => {
	try {
		const response = await fetch(
			`${process.env.NX_CHAT_APP_API_GIPHY_SEARCH}?api_key=${process.env.NX_CHAT_APP_API_GIPHY_KEY}&limit=${10}&q=${valueSearch}`,
		);
		if (!response.ok) {
			throw new Error('Failed to fetch gifs data search');
		}
		const data = await response.json();
		return data.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});

export const gifsReducer = gifsSlice.reducer;

export const gifsActions = {
	...gifsSlice.actions,
	fetchGifsData,
	fetchGifsDataSearch,
};

const { selectAll, selectEntities } = gifsAdapter.getSelectors();

export const getGifsState = (rootState: { [GIFS_FEATURE_KEY]: GifsState }): GifsState => rootState[GIFS_FEATURE_KEY];

export const selectAllgifs = createSelector(getGifsState, selectAll);

export const selectGifsEntities = createSelector(getGifsState, selectEntities);

export const selectGifsDataSearch = createSelector(getGifsState, (state: GifsState) => state.dataGifsSearch);

export const selectLoadingStatusGifs = createSelector(getGifsState, (state: GifsState) => state.loadingStatus);

export const selectValueInputSearch = createSelector(getGifsState, (state: GifsState) => state.valueInputToCheckHandleSearchState);
