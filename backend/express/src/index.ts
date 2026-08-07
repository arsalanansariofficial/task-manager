import { connect } from 'mongoose';

import { env } from '@/lib/config';

connect(env.DATABASE_URL);
