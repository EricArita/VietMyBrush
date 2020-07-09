import { createModel, ModelConfig } from '@rematch/core';
import { AppState } from './interface';

const appModel: ModelConfig<AppState> = createModel({
  state: {
    isOpenLogin: false,
  },
  reducers: {
    toggleLoginModal: (state: AppState, payload: any) => {
      return {
        ...state,
        isOpenLogin: payload,
      };
    },
  },
  effects: {},
});

export default appModel;
