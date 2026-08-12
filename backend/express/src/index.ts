import { connect } from 'mongoose';
import express from 'express';

import { error } from '@/lib/middlewares/error';
import { userRoutes } from '@/modules/user';
import { env } from '@/lib/config';

import { taskRoutes } from './modules/task';

connect(env.DATABASE_URL);

const app = express()
  .use(express.json())
  .use(userRoutes)
  .use(taskRoutes)
  .use(error);

app.listen(env.PORT);
