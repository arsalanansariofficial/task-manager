import { connect } from 'mongoose';
import express from 'express';

import { error } from '@/lib/middlewares/error';
import { userRoutes } from '@/modules/user';
import { taskRoutes } from '@/modules/task';
import { env } from '@/lib/config';

connect(env.DATABASE_URL);

export const app = express()
  .use(express.json())
  .use(userRoutes)
  .use(taskRoutes)
  .use(error);

app.listen(env.PORT);
