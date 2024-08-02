import { combineReducers } from '@reduxjs/toolkit';
import startBlockReducer from './startBlockSlice';
import showInstructionsReducer from './showInstructionsSlice';
import jackpotJunctionReducer from './jackpotJunctionSlice';

const rootReducer = combineReducers({
    startBlock: startBlockReducer,
    showInstructions: showInstructionsReducer,
    jackpotJunction: jackpotJunctionReducer,
    // Add other reducers here if any
});
  
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;