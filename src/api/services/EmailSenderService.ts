import { Container, Service } from 'typedi';
import sgMail from '@sendgrid/mail';
import config from '../../config';
import UserService from './UserService';
import { User } from '../entities/User';

const templates = {
  simple_mail: 'd-e22c21577502499fae3e3d03591bacf8',
  contact_form: 'd-9364b3c533bb400180465bfca372e549',
  reset_password: 'd-f709df7206ab483a97f9e3bc83302a0d',
};

@Service()
export default class EmailSenderService {
  private sendGrid;
  private readonly fromAdress: string;
  private readonly contactAddress: string;
  private userService: UserService;

  constructor() {
    this.userService = Container.get(UserService);
    this.fromAdress = config.sendgridFromEmail;
    this.contactAddress = config.sendgridReplyEmail;
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
      subject: subject,
      templateId: templates.simple_mail,

      dynamic_template_data: {
        subject: subject,
        username: user.pseudo,
        content: content,
      },
    };
    return sgMail.send(mail);
  }

  public async sendNewsletter(content: string, subject: string): Promise<void> {
    for (const user of await this.userService.newsletterUsers()) {
      await this.sendSimple(user.id, content, subject);
    }
  }

  public async sendContactForm(
    firstname: string,
    lastname: string,
    content: string,
    email: string,
    phone: string,
    enterprise?: string
  ): Promise<any> {
    const mail = {
      to: this.contactAddress,
      from: {
        email: this.fromAdress,
        name: 'Vécolo contact',
      },
      subject: 'Formulaire de contact',
      templateId: templates.contact_form,

      dynamic_template_data: {
        subject: 'Formulaire de contact',
        firstname,
        lastname,
        content,
        email,
        phone,
        enterprise,
      },
    };
    return sgMail.send(mail);
  }

  public async sendResetPassword(
    firstname: string,
    lastname: string,
    email: string,
    reset_link: string
  ): Promise<any> {
    const mail = {
      to: email,
      from: {
        email: this.fromAdress,
        name: 'Vécolo contact',
      },
      subject: 'Réinitialiser mon mot de passe',
      templateId: templates.reset_password,

      dynamic_template_data: {
        subject: 'Réinitialiser mon mot de passe',
        firstname,
        lastname,
        reset_link,
      },
    };
    return sgMail.send(mail);
  }
}
