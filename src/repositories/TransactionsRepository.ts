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
    // get all income transactions
    const allIncomeTransactions = await this.find({
      where: { type: 'income' },
    });

    // get all outcome transactions
    const allOutcomeTransactions = await this.find({
      where: { type: 'outcome' },
    });

    // array for income transaction values
    const allIncomeValues: Array<number> = [];

    allIncomeTransactions.forEach(transaction => {
      allIncomeValues.push(transaction.value);
    });

    // array for outcome transaction values
    const allOutcomeValues: Array<number> = [];

    allOutcomeTransactions.forEach(transaction => {
      allOutcomeValues.push(transaction.value);
    });

    // make the mathemagics
    const allIncome = allIncomeValues.reduce((a, b) => a + b, 0);
    const allOutcome = allOutcomeValues.reduce((a, b) => a + b, 0);
    const total = allIncome - allOutcome;

    // create the return object
    const balance = {
      income: allIncome,
      outcome: allOutcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
