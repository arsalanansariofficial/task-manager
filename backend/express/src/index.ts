import express from 'express';
import cors from 'cors';

import connect from '@/lib/mongoose';
import { env } from '@/lib/config';

import userRouter from './modules/routers/user-router';
import taskRouter from './modules/routers/task-router';

connect();

const app = express()
  .use(express.static(env.UPLOAD_DIR))
  .use(express.json())
  .use(userRouter)
  .use(taskRouter)
  .use(cors());

app.listen(env.PORT);
