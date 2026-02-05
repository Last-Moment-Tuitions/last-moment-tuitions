
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: this.configService.get<string>('SMTP_HOST'),
            port: this.configService.get<number>('SMTP_PORT'),
            secure: true, // true for 465
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASS'),
            },
        });
    }

    async sendOtpEmail(email: string, otp: string) {
        try {
            const info = await this.transporter.sendMail({
                from: '"Last Moment Tuitions" <' + this.configService.get<string>('SMTP_USER') + '>', // sender address
                to: email,
                subject: 'Your OTP Code - Last Moment Tuitions',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Password Reset OTP</title>
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 0; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Last Moment Tuitions</h1>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Password Reset Request</h2>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Hello,</p>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed. This code is valid for <strong>50 seconds</strong>.</p>
                                    
                                    <!-- OTP Box -->
                                    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; border: 1px solid #e5e7eb;">
                                        <span style="font-size: 32px; font-weight: bold; color: #1e3a8a; letter-spacing: 5px; font-family: monospace;">${otp}</span>
                                    </div>
                                    
                                    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Last Moment Tuitions. All rights reserved.</p>
                                    <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0;">This is an automated message, please do not reply.</p>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                `,
            });

            console.log('[EmailService] OTP email sent successfully. MessageId:', info.messageId);
            return info;
        } catch (error) {
            console.error('[EmailService] Error sending email:', error);
            throw new Error('Failed to send OTP email');
        }
    }
}
