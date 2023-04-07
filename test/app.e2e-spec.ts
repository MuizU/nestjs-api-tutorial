import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';

describe('App  e2e', function () {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(() => {
    app.close();
  });
  describe('Auth', function () {
    const dto: AuthDto = {
      email: 'muiz@onehundered.com',
      password: '123',
    };
    it('should throw if email empty', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({ password: dto.password })
        .expectStatus(400);
    });
    it('should throw if password empty', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({ email: dto.email })
        .expectStatus(400);
    });
    it("should throw if no body's provided", () => {
      return pactum.spec().post('/auth/signup').expectStatus(400);
    });
    describe('Signup', function () {
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', function () {
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200);
      });
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it("should throw if no body's provided", () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
    });
  });
  describe('User', function () {
    describe('Get me', function () {});
    describe('Edit user', function () {});
  });
  describe('Bookmark', function () {
    describe('Create bookmark', function () {});
    describe('Get all bookmarks', function () {});
    describe('Get bookmark by id', function () {});
    describe('Edit bookmark', function () {});
    describe('Delete bookmark', function () {});
  });
});
