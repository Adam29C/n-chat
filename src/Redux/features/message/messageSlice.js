import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  loadingMessages: false,
  error: null,
};

export const selectUserSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.messages = action.payload;
      state.error = null;
    },
    sendMessages: (state, action) => {
      console.log('action.payloadaction.payload', action.payload);

      state.messages = [...state.messages, action.payload];
      state.error = null;
    },
    setLoadingMessages: (state, action) => {
      state.loadingMessages = action.payload;
      state.error = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMessage, sendMessages, setLoadingMessages } =
  selectUserSlice.actions;

export default selectUserSlice.reducer;
