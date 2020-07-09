import { init } from '@rematch/core';
import createLoadingPlugin from '@rematch/loading';
import profileModel from './models/profile/model';
import appModel from './models/appState/model';

// loading plugin
const loadingOptions = {};
const loading = createLoadingPlugin(loadingOptions);

// init store
export const initStore = (initialState = {}) => {
  return init({
    models: {
      appModel,
      profileModel,
    },
    redux: {
      initialState,
    },
    plugins: [loading],
  });
};
