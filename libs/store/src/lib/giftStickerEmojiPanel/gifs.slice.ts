import { IGifCategory } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

export const GIFS_FEATURE_KEY = 'gifs';

export interface GifCategoriesEntity extends IGifCategory {
	id: string;
}

export const gifsAdapter = createEntityAdapter<GifCategoriesEntity>();

export interface GifsState extends EntityState<GifCategoriesEntity, string> {
	loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
	error?: string | null;
	dataGifsSearch: IGifCategory[];
	valueInputToCheckHandleSearchState?: string;
	dataGifsFeatured: any;
	trendingClickingStatus: boolean
}
export const initialGifsState: GifsState = {
	...gifsAdapter.getInitialState(),
	loadingStatus: 'not loaded',
	error: null,
	dataGifsSearch: [],
	valueInputToCheckHandleSearchState: '',
	dataGifsFeatured: [],
	trendingClickingStatus:false
};

export const fetchGifCategories = createAsyncThunk<any>('gifs/fetchStatus', async (_, thunkAPI) => {
	const baseUrl = process.env.NX_CHAT_APP_API_TENOR_URL_CATEGORIES ?? '';
	const apiKey = process.env.NX_CHAT_APP_API_TENOR_KEY;
	const clientKey = process.env.NX_CHAT_APP_API_CLIENT_KEY_CUSTOM;
	const limit = 10;
	const categoriesUrl = baseUrl + apiKey + '&client_key=' + clientKey + '&limit=' + limit;

	try {
		const response = await fetch(`${categoriesUrl}`);
		if (!response.ok) {
			throw new Error('Failed to fetch gifs data');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});

type FetchGifsDataSearchPayload = any;
export const fetchGifsDataSearch = createAsyncThunk<FetchGifsDataSearchPayload, string>('gifs/fetchDataSearch', async (valueSearch, thunkAPI) => {
	const baseUrl = process.env.NX_CHAT_APP_API_TENOR_URL_SEARCH ?? '';
	const apiKey = process.env.NX_CHAT_APP_API_TENOR_KEY;
	const clientKey = process.env.NX_CHAT_APP_API_CLIENT_KEY_CUSTOM;
	const limit = 30;
	const search_url = baseUrl + valueSearch + '&key=' + apiKey + '&client_key=' + clientKey + '&limit=' + limit;

	try {
		const response = await fetch(`${search_url}`);

		if (!response.ok) {
			throw new Error('Failed to fetch gifs data search');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});

export const fetchGifCategoryFeatured = createAsyncThunk<any>('gifs/fetchDataTrending', async (_, thunkAPI) => {
	const baseUrl = process.env.NX_CHAT_APP_API_TENOR_URL_FEATURED ?? '';
	const apiKey = process.env.NX_CHAT_APP_API_TENOR_KEY;
	const clientKey = process.env.NX_CHAT_APP_API_CLIENT_KEY_CUSTOM;
	const limit = 30;
	const featuredUrl = baseUrl + apiKey + '&client_key=' + clientKey + '&limit=' + limit;

	try {
		const response = await fetch(`${featuredUrl}`);
		if (!response.ok) {
			throw new Error('Failed to fetch gifs data');
		}
		const data = await response.json();
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
		setValueInputSearch: (state, action) => {
			state.valueInputToCheckHandleSearchState = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchGifCategories.pending, (state: GifsState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchGifCategories.fulfilled, (state: GifsState, action: PayloadAction<GifCategoriesEntity[]>) => {
				gifsAdapter.setMany(state, action.payload);
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchGifCategories.rejected, (state: GifsState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
		builder
			.addCase(fetchGifsDataSearch.pending, (state: GifsState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchGifsDataSearch.fulfilled, (state: GifsState, action: PayloadAction<any>) => {
				state.dataGifsSearch = action.payload.results;
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchGifsDataSearch.rejected, (state: GifsState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
		builder
			.addCase(fetchGifCategoryFeatured.pending, (state: GifsState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchGifCategoryFeatured.fulfilled, (state: GifsState, action: PayloadAction<any>) => {
				state.dataGifsFeatured = action.payload.results;
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchGifCategoryFeatured.rejected, (state: GifsState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	},
});

export const gifsReducer = gifsSlice.reducer;

export const gifsActions = {
	...gifsSlice.actions,
	fetchGifCategories,
	fetchGifsDataSearch,
	fetchGifCategoryFeatured,
};

const { selectAll, selectEntities } = gifsAdapter.getSelectors();

export const getGifsState = (rootState: { [GIFS_FEATURE_KEY]: GifsState }): GifsState => rootState[GIFS_FEATURE_KEY];

export const selectAllgifCategory = createSelector(getGifsState, selectAll);

export const selectGifsEntities = createSelector(getGifsState, selectEntities);

export const selectGifsDataSearch = createSelector(getGifsState, (state: GifsState) => state.dataGifsSearch);

export const selectLoadingStatusGifs = createSelector(getGifsState, (state: GifsState) => state.loadingStatus);

export const selectValueInputSearch = createSelector(getGifsState, (state: GifsState) => state.valueInputToCheckHandleSearchState);

export const selectDataGifsFeatured = createSelector(getGifsState, (state: GifsState) => state.dataGifsFeatured);
