import { createSlice } from '@reduxjs/toolkit'
import { useSharedValue } from 'react-native-reanimated'

const initialState = {
    visible: false,
}

export const bottomTabsSlice = createSlice({
    name: 'bottomTabs',
    initialState,
    reducers: {
        show: (state) => {
            state.visible = true
        },
        hide: (state) => {
            state.visible = false
        },
    },
})

// Action creators are generated for each case reducer function
export const { show, hide } = bottomTabsSlice.actions

export default bottomTabsSlice.reducer