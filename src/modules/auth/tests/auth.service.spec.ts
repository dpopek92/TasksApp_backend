import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

const mockGetUserByEmail = jest.fn();
const mockGetUserId = jest.fn();
const mockCreateUser = jest.fn();
const mockUpdate = jest.fn();

const mockUsersService = {
  getUserByEmail: mockGetUserByEmail,
  getUserById: mockGetUserId,
  createUser: mockCreateUser,
  update: mockUpdate,
};

const mockUserCredentials = { email: 'email@email.com', password: 'pass' };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, UsersService, ConfigService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });
  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should call getUserByEmail', async () => {
      await service.register(mockUserCredentials);
      expect(mockGetUserByEmail).toBeCalled();
    });
    it('should call getUserByEmail once', async () => {
      await service.register(mockUserCredentials);
      expect(mockGetUserByEmail).toBeCalledTimes(1);
    });
    it('should call createUser', async () => {
      await service.register(mockUserCredentials);
      expect(mockCreateUser).toBeCalled();
    });
    it('should call createUser once', async () => {
      await service.register(mockUserCredentials);
      expect(mockCreateUser).toBeCalledTimes(1);
    });
  });
  describe('login', () => {
    it('should call getUserByEmail', async () => {
      await service.register(mockUserCredentials);
      expect(mockGetUserByEmail).toBeCalled();
    });
    it('should call getUserByEmail once', async () => {
      await service.register(mockUserCredentials);
      expect(mockGetUserByEmail).toBeCalledTimes(1);
    });
  });
});
