import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpotifyUser } from '../../types/spotify';

export interface SpotifyUserState {
  user: Option<SpotifyUser>;
  token?: string;
  loading: boolean;
}

const initialState: SpotifyUserState = {
  user: None,
  token: '',
  loading: true,
};

const slice = createSlice({
  name: 'spotifyUser',
  initialState,
  reducers: {
    initializeApp: () => initialState,
    setToken: (state, { payload: token }: PayloadAction<any>) => {
      state.token = token;
    },
    loadUser: (state, { payload: user }: PayloadAction<SpotifyUser>) => {
      state.user = Some(user);
      state.loading = false;
    },
    logout: (state) => {
      state.user = None;
    },
    endLoad: (state) => {
      state.loading = false;
    },
  },
});

export const { loadUser, logout, endLoad, initializeApp, setToken } = slice.actions;

export default slice.reducer;
