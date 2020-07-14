import csvParse from 'csv-parse';
import fs from 'fs';

// import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(filePath: string): Promise<Array<[]>> {
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

    const lines: any = [];

    parseCsv.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCsv.on('end', resolve);
    });

    return lines;
  }
}

export default ImportTransactionsService;
