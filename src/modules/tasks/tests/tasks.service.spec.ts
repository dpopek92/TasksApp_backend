import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientSession } from 'mongoose';
import { Task, TaskStatus } from '../schema/task.schema';
import { TasksService } from '../tasks.service';

const mockCreate = jest.fn();
const mockCountDocuments = jest.fn();
const mockFind = jest.fn().mockImplementation(() => ({
  sort: jest.fn().mockImplementation(() => ({
    skip: jest.fn().mockImplementation(() => ({
      limit: jest.fn().mockImplementation(() => ({
        lean: jest.fn().mockImplementation(() => ({
          exec: jest.fn(),
        })),
      })),
    })),
  })),
}));
const mockFindOne = jest.fn().mockImplementation(() => ({
  lean: jest.fn().mockImplementation(() => ({
    exec: jest.fn(),
  })),
}));
const mockFindOneAndUpdate = jest.fn().mockImplementation(() => ({
  lean: jest.fn().mockImplementation(() => ({
    exec: jest.fn(),
  })),
}));
const mockFindOneAndRemove = jest.fn();
const mockDeleteMany = jest.fn();

const mockTaskModel = {
  create: mockCreate,
  countDocuments: mockCountDocuments,
  find: mockFind,
  findOne: mockFindOne,
  findOneAndUpdate: mockFindOneAndUpdate,
  findOneAndRemove: mockFindOneAndRemove,
  deleteMany: mockDeleteMany,
};

const mockCreateTaskDto = { description: 'test' };
const mockUpdateTaskDto = { description: 'test', status: TaskStatus.DONE };
const mockSearchQuery = { pageNumber: 1, itemsPerPage: 5 };
const mockUserId = '123';
const mockTaskId = '123';
const mockClientSession = {} as ClientSession;

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });
  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should call create', async () => {
      await service.create(mockUserId, mockCreateTaskDto);
      expect(mockCreate).toBeCalled();
    });
    it('should call create once', async () => {
      await service.create(mockUserId, mockCreateTaskDto);
      expect(mockCreate).toBeCalledTimes(1);
    });
  });
  describe('findAll', () => {
    it('should call find', async () => {
      await service.findAll(mockUserId, mockSearchQuery);
      expect(mockFind).toBeCalled();
    });
    it('should call find once', async () => {
      await service.findAll(mockUserId, mockSearchQuery);
      expect(mockFind).toBeCalledTimes(1);
    });
    it('should call countDocuments', async () => {
      await service.findAll(mockUserId, mockSearchQuery);
      expect(mockCountDocuments).toBeCalled();
    });
    it('should call countDocuments once', async () => {
      await service.findAll(mockUserId, mockSearchQuery);
      expect(mockCountDocuments).toBeCalledTimes(1);
    });
  });
  describe('findOne', () => {
    it('should call findOne', async () => {
      await service.findOne(mockUserId, mockTaskId);
      expect(mockFindOne).toBeCalled();
    });
    it('should call findOne once', async () => {
      await service.findOne(mockUserId, mockTaskId);
      expect(mockFindOne).toBeCalledTimes(1);
    });
  });
  describe('update', () => {
    it('should call findOneAndUpdate', async () => {
      await service.update(mockUserId, mockTaskId, mockUpdateTaskDto);
      expect(mockFindOneAndUpdate).toBeCalled();
    });
    it('should call findOneAndUpdate once', async () => {
      await service.update(mockUserId, mockTaskId, mockUpdateTaskDto);
      expect(mockFindOneAndUpdate).toBeCalledTimes(1);
    });
  });
  describe('updateField', () => {
    it('should call findOneAndUpdate', async () => {
      await service.update(mockUserId, mockTaskId, mockUpdateTaskDto);
      expect(mockFindOneAndUpdate).toBeCalled();
    });
    it('should call findOneAndUpdate once', async () => {
      await service.update(mockUserId, mockTaskId, mockUpdateTaskDto);
      expect(mockFindOneAndUpdate).toBeCalledTimes(1);
    });
  });
  describe('remove', () => {
    it('should call findOneAndRemove', async () => {
      await service.remove(mockUserId, mockTaskId);
      expect(mockFindOneAndRemove).toBeCalled();
    });
    it('should call findOneAndRemove once', async () => {
      await service.remove(mockUserId, mockTaskId);
      expect(mockFindOneAndRemove).toBeCalledTimes(1);
    });
  });
  describe('removeUserTasks', () => {
    it('should call deleteMany', async () => {
      await service.removeUserTasks(mockUserId, mockClientSession);
      expect(mockDeleteMany).toBeCalled();
    });
    it('should call deleteMany once', async () => {
      await service.removeUserTasks(mockUserId, mockClientSession);
      expect(mockDeleteMany).toBeCalledTimes(1);
    });
  });
});
