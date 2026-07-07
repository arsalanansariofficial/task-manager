import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    user: JSON.parse(sessionStorage.getItem('user')) || null
  },
  reducers: {
    login(state, action) {
      state.user = action.payload;
    },
    setProfilePicture(state, action) {
      state.profilePicture = action.payload;
    },
    logout(state) {
      state.user = null;
      sessionStorage.removeItem('user');
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
