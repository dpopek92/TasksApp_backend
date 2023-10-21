import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatus } from '../schema/task.schema';
import { TasksController } from '../tasks.controller';
import { TasksService } from '../tasks.service';

const mockCreate = jest.fn(),
  mockFindAll = jest.fn(),
  mockFindOne = jest.fn(),
  mockUpdate = jest.fn(),
  mockUpdateField = jest.fn(),
  mockRemove = jest.fn();

const mockTasksService = {
  create: mockCreate,
  findAll: mockFindAll,
  findOne: mockFindOne,
  update: mockUpdate,
  updateField: mockUpdateField,
  remove: mockRemove,
};

const mockJwtPayload = { id: '123' };
const mockTaskId = '123';
const mockCreateTaskDto = {
  description: 'test',
};
const mockUpdateTaskDto = {
  description: 'test',
  status: TaskStatus.DONE,
};
const mockSearchQuery = {
  pageNumber: 1,
  itemsPerPage: 1,
};

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    })
      .overrideProvider(TasksService)
      .useValue(mockTasksService)
      .compile();

    controller = module.get<TasksController>(TasksController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call create', () => {
      controller.create(mockJwtPayload, mockCreateTaskDto);
      expect(mockCreate).toBeCalled();
    });
    it('should call create once', () => {
      controller.create(mockJwtPayload, mockCreateTaskDto);
      expect(mockCreate).toBeCalledTimes(1);
    });
    it('should call create with 123, {description: "test"}', () => {
      controller.create(mockJwtPayload, mockCreateTaskDto);
      expect(mockCreate).toBeCalledWith('123', { ...mockCreateTaskDto });
    });
  });
  describe('findAll', () => {
    it('should call findAll', () => {
      controller.findAll(mockJwtPayload, mockSearchQuery);
      expect(mockFindAll).toBeCalled();
    });
    it('should call findAll once', () => {
      controller.findAll(mockJwtPayload, mockSearchQuery);
      expect(mockFindAll).toBeCalledTimes(1);
    });
    it('should call findAll with 123, {pageNumber:1, itemsPerPage: 5}', () => {
      controller.findAll(mockJwtPayload, mockSearchQuery);
      expect(mockFindAll).toBeCalledWith('123', { ...mockSearchQuery });
    });
  });
  describe('findOne', () => {
    it('should call findOne', () => {
      controller.findOne(mockJwtPayload, mockTaskId);
      expect(mockFindOne).toBeCalled();
    });
    it('should call findOne once', () => {
      controller.findOne(mockJwtPayload, mockTaskId);
      expect(mockFindOne).toBeCalledTimes(1);
    });
    it('should call findOne with 123, 123', () => {
      controller.findOne(mockJwtPayload, mockTaskId);
      expect(mockFindOne).toBeCalledWith('123', '123');
    });
  });
  describe('updateTask', () => {
    it('should call update', () => {
      controller.updateTask(mockJwtPayload, mockTaskId, mockUpdateTaskDto);
      expect(mockUpdate).toBeCalled();
    });
    it('should call update once', () => {
      controller.updateTask(mockJwtPayload, mockTaskId, mockUpdateTaskDto);
      expect(mockUpdate).toBeCalledTimes(1);
    });
    it('should call update with 123, 123, {description:"test", status:"DONE"}', () => {
      controller.updateTask(mockJwtPayload, mockTaskId, mockUpdateTaskDto);
      expect(mockUpdate).toBeCalledWith('123', '123', {
        description: 'test',
        status: 'DONE',
      });
    });
  });
  describe('updateField', () => {
    it('should call updateField', () => {
      controller.updateField(mockJwtPayload, mockTaskId, mockUpdateTaskDto);
      expect(mockUpdateField).toBeCalled();
    });
    it('should call updateField once', () => {
      controller.updateField(mockJwtPayload, mockTaskId, mockUpdateTaskDto);
      expect(mockUpdateField).toBeCalledTimes(1);
    });
    it('should call updateField with 123, 123, {description:"test", status:"DONE"}', () => {
      controller.updateField(mockJwtPayload, mockTaskId, mockUpdateTaskDto);
      expect(mockUpdateField).toBeCalledWith('123', '123', {
        description: 'test',
        status: 'DONE',
      });
    });
  });
  describe('remove', () => {
    it('should call remove', () => {
      controller.remove(mockJwtPayload, mockTaskId);
      expect(mockRemove).toBeCalled();
    });
    it('should call remove once', () => {
      controller.remove(mockJwtPayload, mockTaskId);
      expect(mockRemove).toBeCalledTimes(1);
    });
    it('should call remove with 123, 123', () => {
      controller.remove(mockJwtPayload, mockTaskId);
      expect(mockRemove).toBeCalledWith('123', '123');
    });
  });
});
