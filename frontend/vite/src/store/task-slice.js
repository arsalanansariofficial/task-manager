import { createSlice } from '@reduxjs/toolkit';

const setInitialState = () => {
  const task = JSON.parse(sessionStorage.getItem('task'));
  if (task) return { task };
  return { task: null };
};

const taskSlice = createSlice({
  name: 'taskSlice',
  initialState: setInitialState(),
  reducers: {
    setTask(state, action) {
      state.task = action.payload;
    }
  }
});

export const taskActions = taskSlice.actions;
export default taskSlice.reducer;
