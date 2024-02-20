import { MezonContextValue } from '@mezon/transport';
import { GetThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';

export type AsyncThunkConfigWithMezon = {
	extra: {
		mezon: MezonContextValue;
	};
};

export type GetThunkAPIWithMezon = GetThunkAPI<AsyncThunkConfigWithMezon>;
