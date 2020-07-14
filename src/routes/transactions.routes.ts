import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import multer from 'multer';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);
// import AppError from '../errors/AppError';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({
    relations: ['category_id'],
  });
  const balance = await transactionsRepository.getBalance();

  return response.json({
    transactions,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const { title, value, type, category } = request.body;

  // Create instance of service
  const createTransaction = new CreateTransactionService();

  // execute the service
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  // execute
  const deleted = await deleteTransaction.execute({ id });

  return response.status(204).json(deleted);
});

transactionsRouter.post(
  '/import',
  upload.single('csvFile'),
  async (request, response) => {
    // get file name
    const file = request.file.filename;

    // build file path for csvParse
    const filePath = `${uploadConfig.directory}/${file}`;

    // create instance of import service
    const importTransactionService = new ImportTransactionsService();

    // Create instance of create service
    const createTransaction = new CreateTransactionService();

    // execute it
    const importedTransactions = await importTransactionService.execute(
      filePath,
    );

    return response.json(importedTransactions);
  },
);

export default transactionsRouter;
