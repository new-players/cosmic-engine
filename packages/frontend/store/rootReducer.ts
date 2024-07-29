import { combineReducers } from '@reduxjs/toolkit';
import startBlockReducer from './startBlockSlice';
import showInstructionsReducer from './showInstructionsSlice';

const rootReducer = combineReducers({
    startBlock: startBlockReducer,
    showInstructions: showInstructionsReducer,
    // Add other reducers here if any
});
  
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;