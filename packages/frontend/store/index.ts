import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import startBlockReducer from './startBlockSlice';

const store = configureStore({
  reducer: {
    startBlock: startBlockReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['startBlock/setStartBlock'],
        ignoredActionPaths: ['payload'],
        ignoredPaths: ['startBlock'],
      },
    });
    return defaultMiddleware;
  },
});

export default store;