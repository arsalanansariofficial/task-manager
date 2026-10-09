import { Elysia } from 'elysia';

import { service } from '@/modules/task/service';
import { payload } from '@/modules/task/payload';
import { loadAuthContext } from '@/lib/auth';
import { schema } from '@/lib/util/schema';

export const taskRoutes = new Elysia({ name: 'Task.Routes', prefix: '/tasks' })
  .use(loadAuthContext)
  .get(
    '/',
    async params =>
      await service.getAll({ where: params.query, user: params.user }),
    { response: payload.paginate, query: payload.where }
  )
  .get(
    '/:id',
    async params =>
      await service.get({ params: params.params, user: params.user }),
    { response: payload.read, params: payload.id }
  )
  .delete(
    '/:id',
    async params =>
      await service.deleteTask({ params: params.params, user: params.user }),
    { body: schema.nullish('body'), response: payload.read, params: payload.id }
  )
  .patch(
    '/:id',
    async params =>
      await service.update({ params: params.params, body: params.body }),
    { response: payload.read, body: payload.update, params: payload.id }
  )
  .post(
    '/',
    async params =>
      await service.create({ user: params.user, body: params.body }),
    { response: payload.read, body: payload.create }
  );
