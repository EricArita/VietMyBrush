import nodemailer from 'nodemailer';
import { config } from '@app/config';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.emailAccount.resetPassword.account,
    pass: config.emailAccount.resetPassword.password,
  },
}) as any;
