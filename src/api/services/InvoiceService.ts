import { Inject, Service } from 'typedi';
import CRUD, { getAllParams } from "./CRUD";
import { Invoice, InvoiceRepository } from '../entities/Invoice';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { Between } from 'typeorm';

@Service()
export default class InvoiceService extends CRUD<Invoice> {
  constructor(
    @InjectRepository(Invoice) protected invoiceRepo: InvoiceRepository,
    @Inject('logger') protected logger: Logger
  ) {
    super(invoiceRepo, logger);
  }

  async getAllFromUserInLastGivenMonth(
    id: number,
    date_end: Date
  ): Promise<Invoice[] | null> {
    const date_start: Date = date_end;
    date_start.setMonth(date_start.getMonth() - 1);

    return await this.invoiceRepo.find({
      where: {
        createdAt: Between(date_start, date_end),
        user: { id },
      },
    });
  }

  async getAllFromUser(id: number, param: getAllParams): Promise<Invoice[]> {
    return await this.invoiceRepo.find({
      where: {
        user: id,
      },
      take: param.limit,
      skip: param.offset,
      order: { createdAt: 'DESC' },
    });
  }
}
