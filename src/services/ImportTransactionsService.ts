import { getRepository, getCustomRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface CsvTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    // create instance of Transactions Repository
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // create instance of Categories Repository
    const categoriesRepository = getRepository(Category);

    // create node stream instance
    const readCsvStream = fs.createReadStream(filePath);

    // parse the stream
    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    // parse the csv
    const parseCsv = readCsvStream.pipe(parseStream);

    // start instance of imported transactions array
    const transactions: CsvTransaction[] = [];

    // start instance of imported transactions categories array
    const categories: string[] = [];

    // for each line read, create a transaction object with its values
    parseCsv.on('data', async row => {
      const [title, type, value, category] = row.map((cell: string) => cell);

      if (!title || !type || !value || !category) return;

      categories.push(category);

      transactions.push({ title, type, value, category });
    });

    // when stream emits END event, resolve parser
    await new Promise(resolve => {
      parseCsv.on('end', resolve);
    });

    // check db if any of the imported transactions have an already registered category
    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    // get only the titles of existent categories
    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    // filter main categories array taking off existent ones and filter again to remove duplicates
    const nonExistentCategoriesTitles = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    // create an instance for each new category
    const newCategories = categoriesRepository.create(
      nonExistentCategoriesTitles.map(title => ({
        title,
      })),
    );

    // save it do db
    await categoriesRepository.save(newCategories);

    // create an array of all existent categories
    const allCategories = [...newCategories, ...existentCategories];

    // create an instance of each imported transaction, getting full category data
    const importedTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: allCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    // save it to db
    await transactionsRepository.save(importedTransactions);

    // delete the file from storage
    await fs.promises.unlink(filePath);

    return importedTransactions;
  }
}

export default ImportTransactionsService;
