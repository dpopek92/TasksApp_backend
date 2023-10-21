import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

const mockGetUserById = jest.fn(),
  mockRemove = jest.fn();

const mockUsersService = {
  getUserById: mockGetUserById,
  remove: mockRemove,
};

const mockJwtPayload = { id: '123' };

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should call getUserById', () => {
      controller.getMe(mockJwtPayload);
      expect(mockGetUserById).toBeCalled();
    });
    it('should call getUserById once', () => {
      controller.getMe(mockJwtPayload);
      expect(mockGetUserById).toBeCalledTimes(1);
    });
    it('should call getUserById with 123', () => {
      controller.getMe(mockJwtPayload);
      expect(mockGetUserById).toBeCalledWith('123');
    });
  });
  describe('deleteMe', () => {
    it('should call remove', () => {
      controller.deleteMe(mockJwtPayload);
      expect(mockRemove).toBeCalled();
    });
    it('should call remove once', () => {
      controller.deleteMe(mockJwtPayload);
      expect(mockRemove).toBeCalledTimes(1);
    });
    it('should call getUserById remove 123', () => {
      controller.deleteMe(mockJwtPayload);
      expect(mockRemove).toBeCalledWith('123');
    });
  });
});
