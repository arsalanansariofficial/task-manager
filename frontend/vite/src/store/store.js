import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user-slice';
import tasksReducer from './tasks-slice';
import taskReducer from './task-slice';

const store = configureStore({
  reducer: {
    userSlice: userReducer,
    tasksSlice: tasksReducer,
    taskSlice: taskReducer
  }
});

export default store;
