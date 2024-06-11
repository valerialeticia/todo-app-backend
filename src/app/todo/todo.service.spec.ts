import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity } from './entity/todo.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

const todoEntityList = [
  new TodoEntity({ task: 'task1', isDone: 0 }),
  new TodoEntity({ task: 'task2', isDone: 0 }),
  new TodoEntity({ task: 'task3', isDone: 0 }),
];

const updateEntityItem = new TodoEntity({ task: 'task1', isDone: 1 });

describe('TodoService', () => {
  let todoService: TodoService;
  let todoRepository: Repository<TodoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(todoEntityList),
            findOneOrFail: jest.fn().mockResolvedValue(todoEntityList[0]),
            create: jest.fn().mockReturnValue(todoEntityList[0]),
            merge: jest.fn().mockReturnValue(updateEntityItem),
            save: jest.fn().mockResolvedValue(todoEntityList[0]),
            softDelete: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<TodoEntity>>(
      getRepositoryToken(TodoEntity),
    );
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
    expect(todoRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar uma lista de todos com sucesso', async () => {
      const result = await todoService.findAll();

      expect(result).toEqual(todoEntityList);
      expect(todoRepository.find).toHaveBeenCalledTimes(1);
    });

    it('deve lançar um erro quando findAll quebrar', () => {
      jest.spyOn(todoRepository, 'find').mockRejectedValueOnce(new Error());

      expect(todoService.findAll()).rejects.toThrow();
    });
  });

  describe('findOneOrFail', () => {
    it('deve retornar um todo item com sucesso', async () => {
      const result = await todoService.findOneOrFail('1');

      expect(result).toEqual(todoEntityList[0]);
      expect(todoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('deve lançar um erro quando findOneOrFail quebrar', () => {
      jest
        .spyOn(todoRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      expect(todoService.findOneOrFail('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('deve criar uma nova todo item com sucesso', async () => {
      const data: CreateTodoDto = {
        task: 'task1',
        isDone: 0,
      };

      const result = await todoService.create(data);

      expect(result).toEqual(todoEntityList[0]);
      expect(todoRepository.create).toHaveBeenCalledTimes(1);
      expect(todoRepository.save).toHaveBeenCalledTimes(1);
    });

    it('deve lançar um erro quando create quebrar', () => {
      const data: CreateTodoDto = {
        task: 'task1',
        isDone: 0,
      };

      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());

      expect(todoService.create(data)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('deve editar uma todo item com sucesso', async () => {
      const data: UpdateTodoDto = {
        task: 'task1',
        isDone: 1,
      };

      jest
        .spyOn(todoRepository, 'save')
        .mockResolvedValueOnce(updateEntityItem);

      const result = await todoService.update('1', data);

      expect(result).toEqual(updateEntityItem);
    });

    it('deve lançar uma NotFoundException quando update quebrar', () => {
      const data: UpdateTodoDto = {
        task: 'task1',
        isDone: 0,
      };

      jest
        .spyOn(todoRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      expect(todoService.update('1', data)).rejects.toThrow(NotFoundException);
    });

    it('deve lançar uma exceção quando o save quebrar', () => {
      const data: UpdateTodoDto = {
        task: 'task1',
        isDone: 0,
      };

      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());

      expect(todoService.update('1', data)).rejects.toThrow();
    });
  });

  describe('destroy', () => {
    it('deve deletar um todo item com sucesso', async () => {
      const result = await todoService.deleteById('1');

      expect(result).toBeUndefined();
      expect(todoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(todoRepository.softDelete).toHaveBeenCalledTimes(1);
    });

    it('deve lançar uma NotFoundException', () => {
      jest
        .spyOn(todoRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      expect(todoService.deleteById('1')).rejects.toThrow(NotFoundException);
    });

    it('deve lançar uma exceção quando softDelete quebra no destroy', () => {
      jest
        .spyOn(todoRepository, 'softDelete')
        .mockRejectedValueOnce(new Error());

      expect(todoService.deleteById('1')).rejects.toThrow();
    });
  });
});
