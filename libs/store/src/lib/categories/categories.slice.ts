import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { ensureClient, getMezonCtx } from '../helpers';
import { ApiCategoryDesc } from '@mezon/mezon-js/dist/api.gen';
import { ICategory } from '@mezon/utils';
export const CATEGORIES_FEATURE_KEY = 'categories';

/*
 * Update these interfaces according to your requirements.
 */

export interface CategoriesEntity extends ICategory {
  id: string; // Primary ID
}

export const mapCategoryToEntity  = (categoriesRes: ApiCategoryDesc ) => {
  const id = (categoriesRes as unknown as any).category_id
  return {...categoriesRes, id}
}

export interface CategoriesState extends EntityState<CategoriesEntity, string> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error?: string | null;
  currentCategoryId?: string | null;
}

export const categoriesAdapter = createEntityAdapter<CategoriesEntity>();

/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(fetchCategories())
 * }, [dispatch]);
 * ```
 */
type fetchCategoriesPayload = {
  clanId: string
}
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async ({clanId} : fetchCategoriesPayload, thunkAPI) => {
    console.log('fetch Cate:' , clanId)
    const mezon  = ensureClient(getMezonCtx(thunkAPI));
    const response = await mezon.client.listCategoryDescs(mezon.session, clanId)
    if(!response.categorydesc) {
      return thunkAPI.rejectWithValue([])
    }
    /**
     * Replace this with your custom fetch call.
     * For example, `return myApi.getCategoriess()`;
     * Right now we just return an empty array.
     */
    
    return response.categorydesc.map(mapCategoryToEntity);
  }
);

export const initialCategoriesState: CategoriesState = categoriesAdapter.getInitialState({
  loadingStatus: 'not loaded',
  categories: [],
  error: null,
});

export const categoriesSlice = createSlice({
  name: CATEGORIES_FEATURE_KEY,
  initialState: initialCategoriesState,
  reducers: {
    add: categoriesAdapter.addOne,
    remove: categoriesAdapter.removeOne,
    changeCurrentCategory: (state, action: PayloadAction<string>) => {
      state.currentCategoryId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state: CategoriesState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchCategories.fulfilled,
        (state: CategoriesState, action: PayloadAction<ICategory[]>) => {
          categoriesAdapter.setAll(state,action.payload)
          state.loadingStatus = 'loaded';
        }
      )
      .addCase(fetchCategories.rejected, (state: CategoriesState, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      });
  },
});

/*
 * Export reducer for store configuration.
 */
export const categoriesReducer = categoriesSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(categoriesActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const categoriesActions = 
{...categoriesSlice.actions, fetchCategories }

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllCategories);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = categoriesAdapter.getSelectors();

export const getCategoriesState = (rootState: {
  [CATEGORIES_FEATURE_KEY]: CategoriesState;
}): CategoriesState => rootState[CATEGORIES_FEATURE_KEY];
export const selectAllCategories = createSelector(getCategoriesState, selectAll);
export const selectCurrentCategoryId = createSelector(
  getCategoriesState,
  (state) => state.currentCategoryId
);

export const selectCategoriesEntities = createSelector(
  getCategoriesState,
  selectEntities
);

export const selectCategoryById = (id: string) => createSelector(
  selectCategoriesEntities,
  (categoriesEntities) => categoriesEntities[id]
);

export const selectCurrentCategory = createSelector(
  selectCategoriesEntities,
  selectCurrentCategoryId,
  (categoriesEntities, clanId) => clanId ? categoriesEntities[clanId] : null
);