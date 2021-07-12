import { Service } from 'typedi';
import sgMail from '@sendgrid/mail';
import config from '../../config';

const templates = {
  simple_mail: 'd-e22c21577502499fae3e3d03591bacf8',
};

@Service()
export default class EmailSenderService {
  private sendGrid;
  private readonly fromAdress: string;

  constructor() {
    this.fromAdress = config.sendgridFromEmail;
    this.sendGrid = sgMail;
    this.sendGrid.setApiKey(config.sendGridApiKey);
  }

  public sendSimple(
    email: string,
    content: string,
    subject: string,
    username: string
  ): Promise<any> {
    const mail = {
      to: email,
      from: config.sendgridFromEmail,
      subject: subject,
      templateId: templates.simple_mail,

      dynamic_template_data: {
        subject: subject,
        username: username,
        content: content,
      },
    };

    return sgMail.send(mail);
  }
}
