import Knex from 'knex';
import { Model } from 'objection';

import config from '@/config';

export const connect = () => {
  const knex = Knex({ ...config.knex });

  Model.knex(knex);

  console.log('Connected to database');
};
