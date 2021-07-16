import { Inject, Service } from 'typedi';
import CRUD, { getAllParams } from './CRUD';
import { Invoice, InvoiceRepository } from '../entities/Invoice';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { Between } from 'typeorm';
import PDFDocument from 'pdfkit';
import { ErrorHandler } from '../../helpers/ErrorHandler';
import { format } from 'date-fns';
import { Role, User } from '../entities/User';

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

  async getAllFromUser(
    id: number,
    param: getAllParams
  ): Promise<[Invoice[], number]> {
    return await this.invoiceRepo.findAndCount({
      where: {
        user: { id },
      },
      relations: ['subscription', 'subscription.plan'],
      take: param.limit,
      skip: param.offset,
      order: { createdAt: 'DESC' },
    });
  }

  async getAllFromSubscription(
    id: number,
    param: getAllParams
  ): Promise<Invoice[]> {
    return await this.invoiceRepo.find({
      where: {
        subscription: id,
      },
      take: param.limit,
      skip: param.offset,
      order: { createdAt: 'DESC' },
    });
  }

  async findOneWithRelation(id: number): Promise<Invoice> {
    return await this.getRepo().findOne(id, {
      relations: ['user', 'subscription', 'subscription.plan'],
    });
  }

  async generateInvoicePDF(
    id: number,
    user: User
  ): Promise<PDFKit.PDFDocument> {
    const invoice = await this.findOneWithRelation(id);
    if (!invoice) {
      throw new ErrorHandler(404, "La facture n'existe pas");
    }
    if (user.role == Role.CLIENT && invoice.user.id != user.id) {
      throw new ErrorHandler(
        403,
        "Vous n'êtes pas autorisé à consulter cette facture"
      );
    }
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    InvoiceService.generatePDFHeader(doc);
    InvoiceService.generatePDFCustomerInformation(doc, invoice);
    InvoiceService.generateInvoiceTable(doc, invoice);
    return doc;
  }

  private static generatePDFHeader(doc: PDFKit.PDFDocument) {
    console.log(__dirname);
    doc
      .image('./media/vecolo.png', 50, 30, { height: 60 })
      .fillColor('#212121')
      .fontSize(20)
      .text('Équipe Vécolo', 180, 60)
      .fontSize(10)
      .text('Vécolo Inc.', 200, 50, { align: 'right' })
      .text('242 Rue du Faubourg Saint-Antoine', 200, 65, { align: 'right' })
      .text('Paris 75012', 200, 80, { align: 'right' })
      .moveDown();
  }

  private static generatePDFCustomerInformation(
    doc: PDFKit.PDFDocument,
    invoice: Invoice
  ) {
    doc.fillColor('#212121').fontSize(20).text('Facture', 50, 160);
    InvoiceService.generateHr(doc, 185);
    const customerInformationTop = 200;
    doc
      .fontSize(10)
      .text('N° de la facture :', 50, customerInformationTop)
      .font('Helvetica-Bold')
      .text(invoice.id.toString(), 150, customerInformationTop)
      .font('Helvetica')
      .text('Date de la facture :', 50, customerInformationTop + 15)
      .text(
        format(new Date(invoice.billingDate), 'dd/MM/yyyy'),
        150,
        customerInformationTop + 15
      )
      .font('Helvetica-Bold')
      .text(
        `${invoice.user.firstName} ${invoice.user.lastName.toUpperCase()}`,
        300,
        customerInformationTop
      )
      .font('Helvetica')
      .text(invoice.user.email, 300, customerInformationTop + 15)
      .moveDown();

    InvoiceService.generateHr(doc, 252);
  }

  private static generateInvoiceTable(
    doc: PDFKit.PDFDocument,
    invoice: Invoice
  ) {
    const invoiceTableTop = 330;
    doc.font('Helvetica-Bold');
    InvoiceService.generateTableRow(
      doc,
      invoiceTableTop,
      'Abonnement',
      'Prix (HT)',
      'Taux TVA (%)',
      'Quantité',
      'Total'
    );
    InvoiceService.generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');
    const position = invoiceTableTop + 30;
    InvoiceService.generateTableRow(
      doc,
      position,
      invoice.subscription.plan.name,
      `${((invoice.subscription.plan.price * 100) / 120).toFixed(2)} €`,
      '20 %',
      1,
      `${invoice.subscription.plan.price} €`
    );
    InvoiceService.generateHr(doc, position + 20);
  }

  private static generateHr(doc, y) {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }

  private static generateTableRow(
    doc,
    y,
    item,
    unitCostHT,
    unitCostTTC,
    quantity,
    lineTotal
  ) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(unitCostTTC, 150, y)
      .text(unitCostHT, 280, y, { width: 90, align: 'right' })
      .text(quantity, 370, y, { width: 90, align: 'right' })
      .text(lineTotal, 0, y, { align: 'right' });
  }
}
