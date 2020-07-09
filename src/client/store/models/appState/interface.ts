export interface AppState {
  isOpenLogin: boolean;
}

export interface AppReducers {
  toggleLoginModal: (payload: boolean) => void;
}
