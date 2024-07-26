import { createSlice } from "@reduxjs/toolkit";

// Helper function to get user info from localStorage
const getUserInfo = () => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo ? JSON.parse(userInfo) : null;
};

// Initial state setup
const initialState = {
  isAuthorized: false,
  email: null,
  name: null,
  userId: null,
  token: null,
  isEmailVerified: false,
};

// Get user info if available
const userInfo = getUserInfo();
if (userInfo) {
  initialState.isAuthorized = true;
  initialState.email = userInfo.user.email;
  initialState.name = userInfo.user.name;
  initialState.userId = userInfo.user._id;
  initialState.token = userInfo.token;
  initialState.isEmailVerified = userInfo.user.isEmailVerified;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    appLogin: (state, action) => {
      const { token, user } = action.payload.data;
      state.isAuthorized = true;
      state.email = user.email;
      state.name = user.name;
      state.token = token;
      state.userId = user._id;
      state.isEmailVerified = user.isEmailVerified;
      localStorage.setItem("userInfo", JSON.stringify(action.payload.data));
    },
    appLogout: (state) => {
      state.isAuthorized = false;
      state.email = null;
      state.name = null;
      state.token = null;
      state.userId = null;
      state.isEmailVerified = false;
      localStorage.removeItem("userInfo");
    },
    emailVerified: (state) => {
      state.isEmailVerified = true;
      const userInfo = getUserInfo(); // Re-fetch the user info
      if (userInfo) {
        userInfo.user.isEmailVerified = true;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
    },
  },
});

export const { appLogin, appLogout, emailVerified } = authSlice.actions;
export default authSlice.reducer;
