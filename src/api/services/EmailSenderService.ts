import { Container, Service } from 'typedi';
import sgMail from '@sendgrid/mail';
import config from '../../config';
import UserService from './UserService';

const templates = {
  simple_mail: 'd-e22c21577502499fae3e3d03591bacf8',
};

@Service()
export default class EmailSenderService {
  private sendGrid;
  private readonly fromAdress: string;
  private userService: UserService;

  constructor() {
    this.userService = Container.get(UserService);
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
      from: this.fromAdress,
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

  public async sendNewsletter(content: string, subject: string): Promise<void> {
    for (const user of await this.userService.newsletterUsers()) {
      await this.sendSimple(user.email, content, subject, user.pseudo);
    }
  }
}
