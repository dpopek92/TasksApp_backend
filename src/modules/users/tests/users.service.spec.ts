import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../../tasks/tasks.service';
import { User } from '../schema/user.schema';
import { UsersService } from '../users.service';

const mockRemoveUserTasks = jest.fn();
const mockTasksService = {
  removeUserTasks: mockRemoveUserTasks,
};

const mockFindByIdAndDelete = jest.fn();
const mockCreate = jest.fn();
const mockFindOne = jest.fn().mockImplementation(() => ({
  lean: jest.fn().mockImplementation(() => ({
    exec: jest.fn(),
  })),
}));
const mockFindById = jest.fn().mockImplementation(() => ({
  select: jest.fn().mockImplementation(() => ({
    lean: jest.fn().mockImplementation(() => ({
      exec: jest
        .fn()
        .mockReturnValue({ email: 'email@email.com', password: 'pass' }),
    })),
  })),
}));
const mockFindByIdAndUpdate = jest.fn().mockImplementation(() => ({
  select: jest.fn(),
}));
const mockUserModel = {
  create: mockCreate,
  findOne: mockFindOne,
  findById: mockFindById,
  findByIdAndUpdate: mockFindByIdAndUpdate,
  findByIdAndDelete: mockFindByIdAndDelete,
};

const mockStartSession = jest.fn().mockImplementation(() => ({
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
}));
const mockConnection = {
  startSession: mockStartSession,
};

const mockCreateUserDto = { email: 'email@email.com', password: 'pass' };
const mockUpdateUserDto = { refreshToken: 'token' };
const mockUserId = '123';
const mockUserEmail = 'email@email.com';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        TasksService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getConnectionToken('Database'),
          useValue: mockConnection,
        },
      ],
    })
      .overrideProvider(TasksService)
      .useValue(mockTasksService)
      .compile();

    service = module.get<UsersService>(UsersService);
  });
  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call create', async () => {
      await service.createUser(mockCreateUserDto);
      expect(mockCreate).toBeCalled();
    });
    it('should call create once', async () => {
      await service.createUser(mockCreateUserDto);
      expect(mockCreate).toBeCalledTimes(1);
    });
  });
  describe('getUserById', () => {
    it('should call findById', async () => {
      await service.getUserById(mockUserId);
      expect(mockFindById).toBeCalled();
    });
    it('should call findById once', async () => {
      await service.getUserById(mockUserId);
      expect(mockFindById).toBeCalledTimes(1);
    });
  });
  describe('getUserByEmail', () => {
    it('should call findOne', async () => {
      await service.getUserByEmail(mockUserEmail);
      expect(mockFindOne).toBeCalled();
    });
    it('should call findOne once', async () => {
      await service.getUserByEmail(mockUserEmail);
      expect(mockFindOne).toBeCalledTimes(1);
    });
  });
  describe('update', () => {
    it('should call findByIdAndUpdate', async () => {
      await service.update(mockUserId, mockUpdateUserDto);
      expect(mockFindByIdAndUpdate).toBeCalled();
    });
    it('should call findByIdAndUpdate once', async () => {
      await service.update(mockUserId, mockUpdateUserDto);
      expect(mockFindByIdAndUpdate).toBeCalledTimes(1);
    });
  });
  describe('remove', () => {
    it('should call findByIdAndDelete', async () => {
      await service.remove(mockUserId);
      expect(mockFindByIdAndDelete).toBeCalled();
    });
    it('should call removeUserTasks', async () => {
      await service.remove(mockUserId);
      expect(mockRemoveUserTasks).toBeCalled();
    });
    it('should call findByIdAndDelete once', async () => {
      await service.remove(mockUserId);
      expect(mockFindByIdAndDelete).toBeCalledTimes(1);
    });
    it('should call removeUserTasks once', async () => {
      await service.remove(mockUserId);
      expect(mockRemoveUserTasks).toBeCalledTimes(1);
    });
  });
});
