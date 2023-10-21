import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

const mockRegister = jest.fn(),
  mockLogin = jest.fn(),
  mockRefreshTokens = jest.fn(),
  mockLogout = jest.fn();

const mockAuthService = {
  register: mockRegister,
  login: mockLogin,
  refreshTokens: mockRefreshTokens,
  logout: mockLogout,
};

const mockUserCredentials = {
  email: 'email',
  password: 'pass',
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call register', () => {
      controller.register(mockUserCredentials);
      expect(mockRegister).toBeCalled();
    });
    it('should call register once', () => {
      controller.register(mockUserCredentials);
      expect(mockRegister).toBeCalledTimes(1);
    });
    it('should call register with email:email, password:pass', () => {
      controller.register(mockUserCredentials);
      expect(mockRegister).toBeCalledWith({ ...mockUserCredentials });
    });
  });
  describe('login', () => {
    it('should call login', () => {
      controller.login(mockUserCredentials);
      expect(mockLogin).toBeCalled();
    });
    it('should call login once', () => {
      controller.login(mockUserCredentials);
      expect(mockLogin).toBeCalledTimes(1);
    });
    it('should call login with email:email, password:pass', () => {
      controller.login(mockUserCredentials);
      expect(mockLogin).toBeCalledWith({ ...mockUserCredentials });
    });
  });
});
