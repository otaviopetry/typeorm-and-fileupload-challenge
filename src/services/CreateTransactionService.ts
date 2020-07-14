import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // create instances of repositories
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    // store balance
    const balance = await transactionsRepository.getBalance();

    // if transaction is of outcome type and there is not enough balance, throw error
    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Fundos insuficientes');
    }

    // check if category already exists
    let transactionCategory = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    // if it doesnt, create it and store its ID
    if (!transactionCategory) {
      transactionCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(transactionCategory);
    }

    // create transaction object
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    // save it to db
    await transactionsRepository.save(transaction);

    // return transaction object
    return transaction;
  }
}

export default CreateTransactionService;
