import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('wallets').del();
  const wallets: any[] = [
    {
      id: 1,
      user_id: 1,
      name: 'Admin Wallet',
      balance: 0
    },
    {
      id: 2,
      user_id: 2,
      name: 'User Wallet',
      balance: 0
    }
  ];

  await knex('wallets').insert(wallets);
}
