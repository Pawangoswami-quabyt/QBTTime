import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_USER'),
        to,
        subject,
        html,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendMissingEntriesNotification(to: string, weekStartDate: Date, weekEndDate: Date): Promise<void> {
    const subject = 'Missing Timesheet Entries';
    const html = `
      <p>Hello,</p>
      <p>This is a reminder that you have missing time entries for the week of ${weekStartDate.toDateString()} - ${weekEndDate.toDateString()}.</p>
      <p>Please log your time entries as soon as possible.</p>
    `;
    await this.sendEmail(to, subject, html);
  }

  async sendUnsubmittedEntriesNotification(to: string, weekEndDate: Date): Promise<void> {
    const subject = 'Unsubmitted Weekly Timesheet';
    const html = `
      <p>Hello,</p>
      <p>This is a reminder that your weekly timesheet for the week ending ${weekEndDate.toDateString()} has not been submitted yet.</p>
      <p>Please submit your timesheet.</p>
    `;
    await this.sendEmail(to, subject, html);
  }

  async sendSubmissionConfirmation(to: string, weekEndDate: Date): Promise<void> {
    const subject = 'Timesheet Submitted Successfully';
    const html = `
      <p>Hello,</p>
      <p>This is confirmation that you have successfully submitted your timesheet for the week ending ${weekEndDate.toDateString()}.</p>
    `;
    await this.sendEmail(to, subject, html);
  }

  async sendTimeSheetLockedNotification(to: string, weekEndDate: Date): Promise<void> {
    const subject = 'Your Timesheet was Locked';
    const html = `
      <p>Hello,</p>
      <p>Your timesheet for the week ending ${weekEndDate.toDateString()} was locked by an admin. You are not able to update it.</p>
    `;
    await this.sendEmail(to, subject, html);
  }

  async sendTimeSheetUnLockedNotification(to: string, weekEndDate: Date): Promise<void> {
    const subject = 'Your Timesheet was Unlocked';
    const html = `
      <p>Hello,</p>
      <p>Your timesheet for the week ending ${weekEndDate.toDateString()} was unlocked by an admin. You can now update it.</p>
    `;
    await this.sendEmail(to, subject, html);
  }

  async sendTimeSheetApprovedNotification(to: string, weekEndDate: Date): Promise<void> {
    const subject = 'Your Timesheet was Approved';
    const html = `
      <p>Hello,</p>
      <p>Your timesheet for the week ending ${weekEndDate.toDateString()} was approved by an admin.</p>
    `;
    await this.sendEmail(to, subject, html);
  }
}
