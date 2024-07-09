import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
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