import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authUser: {},
  otherUsers: [],
  selectedUser: null,
  onlineUsers: null,
  showReplay: false,
  PreviewImage: false,
  getDocuments: {},
  details: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUsers: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    VisiblityReplay: (state, action) => {
      state.showReplay = action.payload;
    },
    ManageReplayDetails: (state, action) => {
      state.details = action.payload;
    },
    VisiblityPreviewImage: (state, action) => {
      state.PreviewImage = action.payload;
    },
    UploadDocument: (state, action) => {
      state.getDocuments = action.payload;
    },
  },
});

export const {
  VisiblityReplay,
  UploadDocument,
  setAuthUser,
  setOtherUsers,
  setSelectedUsers,
  setOnlineUsers,
  ManageReplayDetails,
  VisiblityPreviewImage,
} = userSlice.actions;

export default userSlice.reducer;
