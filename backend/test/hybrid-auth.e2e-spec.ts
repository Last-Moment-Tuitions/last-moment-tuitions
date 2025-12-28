import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Redis } from 'ioredis';
import { Model } from 'mongoose';
import { UserDocument } from '../src/users/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('Hybrid Auth (E2E)', () => {
    let app: INestApplication;
    let redis: Redis;
    let userModel: Model<UserDocument>;

    const testUser = {
        email: 'hybrid_test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'Hybrid'
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

    it('1. Should register user', async () => {
        await userModel.deleteMany({ email: testUser.email }); // cleanup
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({ ...testUser, phone: 1234567890 })
            .expect(201);
    });

    let firstSessionId: string;

    it('2. Should login and create activeSessions in Mongo & Redis', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password })
            .expect(200);

        firstSessionId = res.body.accessToken;
        expect(firstSessionId).toBeDefined();

        // Verify Redis
        const inRedis = await redis.exists(`session:${firstSessionId}`);
        expect(inRedis).toBe(1);

        // Verify Mongo
        const user = await userModel.findOne({ email: testUser.email });
        expect(user.activeSessions).toContain(firstSessionId);
    });

    it('3. Should reuse the SAME session on second login', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password })
            .expect(200);

        expect(res.body.accessToken).toBe(firstSessionId);

        // Verify Mongo count is still 1
        const user = await userModel.findOne({ email: testUser.email });
        expect(user.activeSessions.length).toBe(1);
    });

    it('4. Should REJECT login if Session is in Mongo but MISSING in Redis (Simulate Consistency Failure)', async () => {
        // Manually delete session from Redis but keep in Mongo
        await redis.del(`session:${firstSessionId}`);

        // Verify state before test
        const userBefore = await userModel.findOne({ email: testUser.email });
        expect(userBefore.activeSessions).toContain(firstSessionId);

        // Attempt Login -> Should Fail
        await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password })
            .expect(401)
            .expect((res) => {
                expect(res.body.message).toContain('Session expired');
            });
    });

    it('5. Should cleanup Mongo after 401', async () => {
        const user = await userModel.findOne({ email: testUser.email });
        expect(user.activeSessions).not.toContain(firstSessionId);
        expect(user.activeSessions.length).toBe(0);
    });

    it('6. Should allow new login after cleanup', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password })
            .expect(200);

        const newSessionId = res.body.accessToken;
        expect(newSessionId).not.toBe(firstSessionId);
        expect(newSessionId).toBeDefined();

        // Verify Redis & Mongo
        const inRedis = await redis.exists(`session:${newSessionId}`);
        expect(inRedis).toBe(1);
        const user = await userModel.findOne({ email: testUser.email });
        expect(user.activeSessions).toContain(newSessionId);
    });
});
