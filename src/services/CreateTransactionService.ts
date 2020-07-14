import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

// import AppError from '../errors/AppError';

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
    // create instance of repository
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const categoriesRepository = getRepository(Category);

    let getCategoryId = '';

    const categoryExists = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!categoryExists) {
      const newCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(newCategory);

      getCategoryId = newCategory.id;
    } else {
      getCategoryId = categoryExists.id;
    }

    // create transaction object
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: getCategoryId,
    });

    // save it to db
    await transactionsRepository.save(transaction);

    // return transaction object
    return transaction;
  }
}

export default CreateTransactionService;
