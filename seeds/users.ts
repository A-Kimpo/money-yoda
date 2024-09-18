import { UserType } from '@/models/userModel';
import { Knex } from 'knex';
import { argon2i } from 'argon2-ffi';
import crypto from 'crypto';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  const users: UserType[] = [
    {
      id: 1,
      email: 'admin@email.com',
      password: await argon2i.hash('admin', crypto.randomBytes(32)),
      is_admin: true
    },
    {
      id: 2,
      email: 'user@email.com',
      password: await argon2i.hash('user', crypto.randomBytes(32))
    }
  ];

  await knex('users').insert(users);
}
