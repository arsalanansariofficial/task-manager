import { mkdir, rm } from 'node:fs/promises';
import { treaty } from '@elysia/eden';
import { reset } from 'drizzle-seed';

import { schema, Status, task } from '@/lib/db/schema';
import { env } from '@/lib/config';
import { ctx } from '@/lib/auth';
import { app } from '@/server';
import { db } from '@/lib/db';

export const unknown = {
  tasks: [
    {
      title: 'Learn about SwampFire',
      status: 'incomplete' as const,
      id: crypto.randomUUID()
    }
  ],
  password: 'Unknown.Password@123',
  email: 'unknown@cn.com',
  name: 'Ben Tennyson'
};

export const ben = {
  password: 'Ben.Tennyson@123',
  id: crypto.randomUUID(),
  name: 'Ben Tennyson',
  email: 'ben@cn.com'
};

export const gwen = {
  password: 'Gwen.Tennyson@123',
  id: crypto.randomUUID(),
  name: 'Gwen Tennyson',
  email: 'gwen@cn.com'
};

export const kevin = {
  password: 'Kevin.Eleven@123',
  name: 'Kevin Ethan Leven',
  id: crypto.randomUUID(),
  email: 'kevin@cn.com'
};

export const bensTasks = [
  {
    title: 'Learn about SwampFire',
    status: Status.incomplete,
    id: crypto.randomUUID(),
    userId: ben.id
  }
];

export const gwensTasks = [
  {
    title: 'Meet Charm Caster',
    status: Status.incomplete,
    id: crypto.randomUUID(),
    userId: gwen.id
  }
];

export const kevinsTasks = [
  {
    status: Status.complete,
    id: crypto.randomUUID(),
    title: 'Stop aggregor',
    userId: kevin.id
  }
];

export const api = treaty(app);

export async function setupDb() {
  await Promise.all([resetDb(), resetDisk()]);

  await Promise.all([
    ctx.saveUser(ctx.createUser(ben)),
    ctx.saveUser(ctx.createUser(gwen)),
    ctx.saveUser(ctx.createUser(kevin))
  ]);

  await Promise.all([
    db.insert(task).values(bensTasks),
    db.insert(task).values(gwensTasks),
    db.insert(task).values(kevinsTasks)
  ]);
}

export async function resetDisk() {
  await rm(env.UPLOAD_DIR, { recursive: true, force: true });
  await mkdir(env.UPLOAD_DIR, { recursive: true });
  await Bun.write(`${env.UPLOAD_DIR}/.gitkeep`, String());
}

export function getSessionCookie(headers: Headers) {
  return { headers: { cookie: headers.get('cookie') } };
}

export async function resetDb() {
  await reset(db, schema);
}
