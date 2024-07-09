import { combineReducers } from '@reduxjs/toolkit';
import startBlockReducer from './startBlockSlice';

const rootReducer = combineReducers({
    startBlock: startBlockReducer,
    // Add other reducers here if any
});
  
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;