import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

// set Promise type again later
interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO

    /* const allIncomeTransactions = await this.find({
      where: { type: 'income' },
    });

    const allOutcomeTransactions = await this.find({
      where: { type: 'outcome' },
    }); */

    const balance = {
      income: 4000,
      outcome: 2000,
      total: 2000,
    };

    return balance;
  }
}

export default TransactionsRepository;
