import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Redis } from 'ioredis';
import { Model } from 'mongoose';
import { UserDocument } from '../src/users/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { createHash } from 'crypto';

describe('Device-Aware Session Management (E2E)', () => {
    let app: INestApplication;
    let redis: Redis;
    let userModel: Model<UserDocument>;

    const testUser = {
        email: 'device_test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'Device'
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        redis = moduleFixture.get('REDIS_CLIENT');
        userModel = moduleFixture.get(getModelToken('User'));
        await app.init();
    });

    afterAll(async () => {
        await userModel.deleteMany({ email: testUser.email });
        await app.close();
    });

    it('0. Setup: Register User', async () => {
        await userModel.deleteMany({ email: testUser.email });
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({ ...testUser, phone: 1234567890 })
            .expect(201);
    });

    let sessionA: string;
    let sessionB: string;

    const deviceA_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/100.0.0.0';
    const deviceB_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'; // Mobile

    it('1. Login from Device A -> Creates Session A', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .set('User-Agent', deviceA_UA)
            .send({ email: testUser.email, password: testUser.password })
            .expect(200);

        sessionA = res.body.accessToken;
        expect(sessionA).toBeDefined();

        // Verify Device Hash in Redis
        const sessionData = await redis.hgetall(`session:${sessionA}`);
        console.log('DEBUG Test 1 Session Data:', sessionData);

        expect(sessionData.deviceHash).toBeDefined();
    });

    it('2. Login AGAIN from Device A -> REUSES Session A', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .set('User-Agent', deviceA_UA)
            .send({ email: testUser.email, password: testUser.password })
            .expect(200);

        console.log('DEBUG Test 2: Expected', sessionA, 'Got', res.body.accessToken);
        expect(res.body.accessToken).toBe(sessionA);
    });

    it('3. Login from Device B (Incognito/Mobile) -> Creates Session B (NEW)', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .set('User-Agent', deviceB_UA) // Different UA
            .send({ email: testUser.email, password: testUser.password })
            .expect(200);

        sessionB = res.body.accessToken;
        console.log('DEBUG Test 3: Session B:', sessionB);

        expect(sessionB).toBeDefined();
        expect(sessionB).not.toBe(sessionA); // Must be different!
    });

    it('4. Both sessions should exist in Redis & Mongo', async () => {
        const existsA = await redis.exists(`session:${sessionA}`);
        const existsB = await redis.exists(`session:${sessionB}`);
        console.log('DEBUG Test 4 Exists:', { A: existsA, B: existsB });

        expect(existsA).toBe(1);
        expect(existsB).toBe(1);

        const user = await userModel.findOne({ email: testUser.email });
        console.log('DEBUG Test 4 ActiveSessions:', user.activeSessions);
        expect(user.activeSessions).toContain(sessionA);
        expect(user.activeSessions).toContain(sessionB);
        expect(user.activeSessions.length).toBe(2);
    });
});
