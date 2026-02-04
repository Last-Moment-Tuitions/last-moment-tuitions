
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
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                            .otp-box { background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
                            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🔐 Password Reset</h1>
                            </div>
                            <div class="content">
                                <p>Hello,</p>
                                <p>You requested to reset your password. Use the OTP code below to verify your identity:</p>
                                
                                <div class="otp-box">
                                    <div class="otp-code">${otp}</div>
                                </div>
                                
                                <p><strong>This code will expire in 60 seconds.</strong></p>
                                <p>If you didn't request this, please ignore this email.</p>
                                
                                <div class="footer">
                                    <p>© ${new Date().getFullYear()} Last Moment Tuitions. All rights reserved.</p>
                                </div>
                            </div>
                        </div>
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
