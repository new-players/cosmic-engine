import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StartBlockState {
  startBlock: bigint  | null;
}

const initialState: StartBlockState = {
  startBlock: null,
};

const startBlockSlice = createSlice({
  name: 'startBlock',
  initialState,
  reducers: {
    setStartBlock(state, action: PayloadAction<bigint | null >) {
      state.startBlock = action.payload;
    },
  },
});

export const { setStartBlock } = startBlockSlice.actions;
export default startBlockSlice.reducer;