import { createSlice } from '@reduxjs/toolkit';

const setInitialState = () => {
  const tasks = JSON.parse(sessionStorage.getItem('tasks'));
  if (tasks) return tasks;
  return {
    tasks: []
  };
};

const tasksSlice = createSlice({
  name: 'tasksSlice',
  initialState: setInitialState(),
  reducers: {
    setTasks(state, action) {
      state.tasks = action.payload;
    }
  }
});

export const tasksActions = tasksSlice.actions;
export default tasksSlice.reducer;
