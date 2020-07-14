import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

// import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<any> {
    // create repository instance
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // delete the requested transaction by id
    const deleted = await transactionsRepository.delete({
      id,
    });

    return deleted;
  }
}

export default DeleteTransactionService;
