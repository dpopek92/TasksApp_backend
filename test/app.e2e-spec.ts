import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';
import * as request from 'supertest';
import {
  ExecutionContext,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from '../src/modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TasksService } from '../src/modules/tasks/tasks.service';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { User } from '../src/modules/users/schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { Task } from '../src/modules/tasks/schema/task.schema';
import { AccessTokenGuard } from '../src/common/guards/access-token.guard';
import { TasksController } from '../src/modules/tasks/tasks.controller';

const mockStartSession = jest.fn().mockImplementation(() => ({
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
}));
const mockConnection = {
  startSession: mockStartSession,
};

const getToken = () => {
  const token = new JwtService({
    secret: `JWT_Secret`,
    signOptions: { expiresIn: `5m` },
  }).sign({ id: '123' });
  return token;
};
const mockJwtService = {
  signAsync: jest.fn().mockReturnValue(getToken()),
};

const mockFindByIdAndDelete = jest.fn();
const mockCreate = jest.fn();
const mockFindOneUser = jest.fn().mockImplementation(() => ({
  lean: jest.fn().mockImplementation(() => ({
    exec: jest
      .fn()
      .mockReturnValue({ email: 'email@email.com', password: 'password' }),
  })),
}));
const mockFindOneTask = jest.fn().mockImplementation(() => ({
  lean: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockReturnValue({ description: 'desc', status: 'DONE' }),
  })),
}));
const mockFindOneWithoutResult = {
  lean: jest.fn().mockImplementation(() => ({
    exec: jest.fn(),
  })),
};
const mockFindById = jest.fn().mockImplementation(() => ({
  select: jest.fn().mockImplementation(() => ({
    lean: jest.fn().mockImplementation(() => ({
      exec: jest.fn(),
    })),
  })),
}));
const mockFindByIdAndUpdate = jest.fn().mockImplementation(() => ({
  select: jest.fn(),
}));
const mockUserModel = {
  create: mockCreate,
  findOne: mockFindOneUser,
  findById: mockFindById,
  findByIdAndUpdate: mockFindByIdAndUpdate,
  findByIdAndDelete: mockFindByIdAndDelete,
};
const mockTasksModel = {
  create: mockCreate,
  findOne: mockFindOneTask,
  findById: mockFindById,
  findByIdAndUpdate: mockFindByIdAndUpdate,
  findByIdAndDelete: mockFindByIdAndDelete,
};

const mockUserCredentials = {
  email: 'email@email.com',
  password: 'password',
};

describe('AuthController', () => {
  let app: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController, TasksController],
      providers: [
        AuthService,
        UsersService,
        ConfigService,
        JwtService,
        TasksService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Task.name),
          useValue: mockTasksModel,
        },
        {
          provide: getConnectionToken('Database'),
          useValue: mockConnection,
        },
      ],
    })
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .overrideGuard(AccessTokenGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          const accessToken = req.headers.authorization;

          if (!accessToken) {
            throw new UnauthorizedException();
          }
          req.user = { id: '123' };
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.init();
  });

  afterEach(() => jest.clearAllMocks());
  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    describe('POST /api/auth/register', () => {
      it('should return 201 when data is correct', () => {
        jest
          .spyOn(mockUserModel, `findOne`)
          .mockImplementationOnce(() => mockFindOneWithoutResult);
        jest.spyOn(bcrypt, `hash`).mockImplementationOnce(() => 'hash');

        return request(app.getHttpServer())
          .post('/api/auth/register')
          .send(mockUserCredentials)
          .expect(201);
      });
      it('should return 400 when user exists', () => {
        jest.spyOn(bcrypt, `hash`).mockImplementationOnce(() => 'hash');

        return request(app.getHttpServer())
          .post('/api/auth/register')
          .send(mockUserCredentials)
          .expect(400);
      });
      it('should return 400 when data is incorrect', () => {
        return request(app.getHttpServer())
          .post('/api/auth/register')
          .send({ email: 'test' })
          .expect(400);
      });
      it('should return 400 when there is no data', () => {
        return request(app.getHttpServer())
          .post('/api/auth/register')
          .expect(400);
      });
    });
    describe('POST /api/auth/login', () => {
      it('should return 200 when data is correct', () => {
        jest.spyOn(bcrypt, `compare`).mockImplementationOnce(() => true);

        return request(app.getHttpServer())
          .post('/api/auth/login')
          .send(mockUserCredentials)
          .expect(200);
      });
      it('should return 400 when data is incorrect', () => {
        return request(app.getHttpServer())
          .post('/api/auth/login')
          .send({ email: 'test' })
          .expect(400);
      });
      it('should return 400 when there is no data', () => {
        return request(app.getHttpServer()).post('/api/auth/login').expect(400);
      });
    });
  });
  describe('Tasks', () => {
    describe('GET /api/tasks/123', () => {
      it('should return 401 when there is no token', () => {
        return request(app.getHttpServer()).get('/api/tasks/123').expect(401);
      });
      it('should return 200 when task exists', async () => {
        jest.spyOn(bcrypt, `compare`).mockImplementationOnce(() => true);

        const res = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send(mockUserCredentials)
          .expect(200);

        return request(app.getHttpServer())
          .get('/api/tasks/123')
          .set('Authorization', 'Bearer ' + res.body.accessToken)
          .expect(200);
      });
    });
  });
});
