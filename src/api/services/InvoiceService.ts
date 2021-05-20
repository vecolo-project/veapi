import { Inject, Service } from 'typedi';
import CRUD from './CRUD';
import { Invoice, InvoiceRepository } from '../entities/Invoice';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';

@Service()
export default class InvoiceService extends CRUD<Invoice> {
  constructor(
    @InjectRepository(Invoice) protected invoiceRepo: InvoiceRepository,
    @Inject('logger') protected logger: Logger
  ) {
    super(invoiceRepo, logger);
  }

  async getAllFromUserInPreviousMonth(
    id: number,
    date_end: Date
  ): Promise<Invoice[] | null> {
    const date_start: Date = date_end;
    date_start.setMonth(date_start.getMonth() - 1);
    return this.invoiceRepo
      .createQueryBuilder('Invoice')
      .where('createdAt BETWEEN :date_start AND date_end AND user= :id', {
        date_start: date_start,
        date_end: date_end,
        id: id,
      })
      .getMany();
  }
}
