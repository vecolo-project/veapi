import { Container, Service } from 'typedi';
import sgMail from '@sendgrid/mail';
import config from '../../config';
import UserService from './UserService';
import { User } from '../entities/User';

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

  public async sendSimple(
    userId: number,
    content: string,
    subject: string
  ): Promise<any> {
    const user: User = await this.userService.findOne(userId);

    const mail = {
      to: user.email,
      from: {
        email: this.fromAdress,
        name: 'Vécolo',
      },
      subject: `${subject}`,
      templateId: templates.simple_mail,

      dynamic_template_data: {
        subject: `${subject}`,
        username: user.pseudo,
        content: `${content}`,
      },
    };
    return sgMail.send(mail);
  }

  public async sendNewsletter(content: string, subject: string): Promise<void> {
    for (const user of await this.userService.newsletterUsers()) {
      await this.sendSimple(user.id, content, subject);
    }
  }
}
