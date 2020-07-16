import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // get all transactions from THIS repository
    const transactions = await this.find();

    const balance = transactions.reduce(
      (acummulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            acummulator.income += Number(transaction.value);
            break;

          case 'outcome':
            acummulator.outcome += Number(transaction.value);
            break;

          default:
            break;
        }

        return acummulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const { income, outcome } = balance;
    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
