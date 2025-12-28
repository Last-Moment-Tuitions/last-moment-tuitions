"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("./../src/app.module");
describe('Auth System (E2E)', () => {
    let app;
    const email = 'test@example.com';
    const password = 'StrongPassword123!';
    let accessToken1;
    let accessToken2;
    let accessToken3;
    let accessToken4;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    describe('Authentication Flow', () => {
        it('/auth/signup (POST) - Register new user', () => {
            return request(app.getHttpServer())
                .post('/auth/signup')
                .send({ email, password, firstName: 'Test', lastName: 'User' })
                .expect(201);
        });
        it('/auth/login (POST) - Login 1st device', async () => {
            const res = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email, password })
                .expect(200);
            accessToken1 = res.body.accessToken;
            expect(accessToken1).toBeDefined();
        });
        it('/auth/login (POST) - Login 2nd device', async () => {
            const res = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email, password })
                .expect(200);
            accessToken2 = res.body.accessToken;
        });
        it('/auth/login (POST) - Login 3rd device', async () => {
            const res = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email, password })
                .expect(200);
            accessToken3 = res.body.accessToken;
        });
        it('/auth/login (POST) - Login 4th device (Maximum Reached)', async () => {
            const res = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email, password })
                .expect(200);
            accessToken4 = res.body.accessToken;
        });
        it('/auth/me (GET) - 1st Session should be EVICTED', () => {
            return request(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', `Bearer ${accessToken1}`)
                .expect(401);
        });
        it('/auth/me (GET) - 2nd Session should be ACTIVE', () => {
            return request(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', `Bearer ${accessToken2}`)
                .expect(200);
        });
        it('/auth/me (GET) - 4th Session should be ACTIVE', () => {
            return request(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', `Bearer ${accessToken4}`)
                .expect(200);
        });
    });
});
//# sourceMappingURL=app.e2e-spec.js.map