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

    const allIncomeTransactions = await this.find({
      where: { type: 'income' },
    });

    const allOutcomeTransactions = await this.find({
      where: { type: 'outcome' },
    });

    const allIncomeValues: Array<number> = [];

    allIncomeTransactions.forEach(transaction => {
      allIncomeValues.push(transaction.value);
    });

    const allOutcomeValues: Array<number> = [];

    allOutcomeTransactions.forEach(transaction => {
      allOutcomeValues.push(transaction.value);
    });

    const allIncome = allIncomeValues.reduce((a, b) => a + b, 0);
    const allOutcome = allOutcomeValues.reduce((a, b) => a + b, 0);
    const total = allIncome - allOutcome;

    const balance = {
      income: allIncome,
      outcome: allOutcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
