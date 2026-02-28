import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
    constructor(private configService: ConfigService) {}

    onModuleInit() {
        if (!admin.apps.length) {
            const serviceAccountJSON = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT');
            if (!serviceAccountJSON) {
                 console.warn('[FirebaseAdmin] No FIREBASE_SERVICE_ACCOUNT env found. Please provide JSON string.');
                 return;
            }
            try {
                const serviceAccount = JSON.parse(serviceAccountJSON);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
            } catch (err) {
                 console.error('[FirebaseAdmin] Failed to parse FIREBASE_SERVICE_ACCOUNT JSON.', err);
            }
        }
    }

    async verifyToken(token: string) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            return decodedToken;
        } catch (error) {
            throw new UnauthorizedException('Invalid Firebase token');
        }
    }
}
