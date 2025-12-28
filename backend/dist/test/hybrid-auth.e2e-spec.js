"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
const mongoose_1 = require("@nestjs/mongoose");
describe('Hybrid Auth (E2E)', () => {
    let app;
    let redis;
    let userModel;
    const testUser = {
        email: 'hybrid_test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'Hybrid'
    };
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        redis = moduleFixture.get('REDIS_CLIENT');
        userModel = moduleFixture.get((0, mongoose_1.getModelToken)('User'));
        await app.init();
    });
    afterAll(async () => {
        await userModel.deleteMany({ email: testUser.email });
        await app.close();
    });
    it('1. Should register user', async () => {
        await userModel.deleteMany({ email: testUser.email });
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send(Object.assign(Object.assign({}, testUser), { phone: 1234567890 }))
            .expect(201);
    });
    let firstSessionId;
    it('2. Should login and create activeSessions in Mongo & Redis', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password })
            .expect(200);
        firstSessionId = res.body.accessToken;
        expect(firstSessionId).toBeDefined();
        const inRedis = await redis.exists(`session:${firstSessionId}`);
        expect(inRedis).toBe(1);
        const user = await userModel.findOne({ email: testUser.email });
        expect(user.activeSessions).toContain(firstSessionId);
    });
    it('3. Should reuse the SAME session on second login', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password })
            .expect(200);
        expect(res.body.accessToken).toBe(firstSessionId);
        const user = await userModel.findOne({ email: testUser.email });
        expect(user.activeSessions.length).toBe(1);
    });
    it('4. Should REJECT login if Session is in Mongo but MISSING in Redis (Simulate Consistency Failure)', async () => {
        await redis.del(`session:${firstSessionId}`);
        const userBefore = await userModel.findOne({ email: testUser.email });
        expect(userBefore.activeSessions).toContain(firstSessionId);
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
        const inRedis = await redis.exists(`session:${newSessionId}`);
        expect(inRedis).toBe(1);
        const user = await userModel.findOne({ email: testUser.email });
        expect(user.activeSessions).toContain(newSessionId);
    });
});
//# sourceMappingURL=hybrid-auth.e2e-spec.js.map