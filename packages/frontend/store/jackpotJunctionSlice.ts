import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface JackpotJunctionState {
    isBonusWheel:boolean;
}

const initialState: JackpotJunctionState = {
    isBonusWheel: true,
};

const jackpotJunctionSlice = createSlice({
    name: 'jackpotJunction',
    initialState,
    reducers: {
        setIsBonusWheel(state, action: PayloadAction<boolean>) {
            state.isBonusWheel = action.payload;
        },
    },
});

export const { setIsBonusWheel } = jackpotJunctionSlice.actions;
export default jackpotJunctionSlice.reducer;