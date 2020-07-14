import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

// import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<any> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const deleted = await transactionsRepository.delete({
      id,
    });

    return deleted;
  }
}

export default DeleteTransactionService;
