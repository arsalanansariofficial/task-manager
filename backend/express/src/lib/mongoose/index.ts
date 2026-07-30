import mongoose from 'mongoose';

import { env } from '@/lib/config';

mongoose.set('strictQuery', true);

export default function connect() {
  return mongoose.connect(env.DATABASE_URL, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true
  });
}
