import { Knex } from 'knex';

const randomDate = () => {
  const start = new Date(2022, 0, 1);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const randomArrElement = (arr: any[]) => Math.floor(Math.random() * arr.length);

const randomTransactions = (walletId: number) => {
  const transactionTypes = ['income', 'expense'];
  const transactionAmounts = Array(1000)
    .fill(0)
    .map((_) => Math.floor(Math.random() * 10000));
  const transactionTags = [
    'Food',
    'Transport',
    'Entertainment',
    'Clothing',
    'Housing',
    'Health',
    'Education',
    'Personal',
    'Other'
  ];

  const transactions: any[] = [];

  for (let i = 0; i < 1000; i++) {
    const date = randomDate();

    transactions.push({
      wallet_id: walletId,
      type: transactionTypes[randomArrElement(transactionTypes)],
      amount: transactionAmounts[randomArrElement(transactionAmounts)],
      tag: transactionTags[randomArrElement(transactionTags)],
      category: 'Transaction category',
      description: 'Transaction description',
      date_added: date,
      date_modified: date
    });
  }

  return transactions;
};

export async function seed(knex: Knex): Promise<void> {
  await knex('transactions').del();

  const wallets: any[] = [1, 2];
  let transactions: any[] = [];

  for (const wallet of wallets) {
    transactions = [...transactions, ...randomTransactions(wallet)];
  }

  await knex('transactions').insert(transactions);
}
