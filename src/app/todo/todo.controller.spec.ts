import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoEntity } from './entity/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

const tododEntityList: TodoEntity[] = [
  new TodoEntity({ id: '1', task: 'task1', isDone: 0 }),
  new TodoEntity({ id: '2', task: 'task2', isDone: 0 }),
  new TodoEntity({ id: '3', task: 'task3', isDone: 0 }),
];

const newTodoEntity = new TodoEntity({ task: 'test', isDone: 0 });

const updatedTodoEntity = new TodoEntity({ task: 'task1', isDone: 1 });

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController], // mockando lista de controllers
      providers: [
        {
          // mockando apenas o provide que quero sem precisar fazer teste de integração e em seguida mockar todas as suas funções
          provide: TodoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(tododEntityList),
            create: jest.fn().mockResolvedValue(newTodoEntity),
            findOneOrFail: jest.fn().mockResolvedValue(tododEntityList[0]),
            update: jest.fn().mockResolvedValue(updatedTodoEntity),
            deleteById: jest.fn().mockReturnValue(undefined),
          },
        },
      ], // mockando lista de providers
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('o controller e o service devem estar definidos', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('index', () => {
    it('deve retornar a todolist Entity com sucesso', async () => {
      const result = await todoController.index();

      expect(result).toEqual(tododEntityList);
      expect(typeof result).toEqual('object');
      expect(todoService.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve ser lançado um erro quando o index quebrar', () => {
      jest.spyOn(todoService, 'findAll').mockRejectedValueOnce(new Error());

      expect(todoController.index()).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('deve criar um novo item do todo com sucesso', async () => {
      const body: CreateTodoDto = {
        task: 'test',
        isDone: 0,
      };

      const result = await todoController.create(body);

      expect(result).toEqual(newTodoEntity);
      expect(todoService.create).toHaveBeenCalledTimes(1);
      expect(todoService.create).toHaveBeenCalledWith(body);
    });

    it('deve lançar um erro quando o create quebrar', () => {
      const body: CreateTodoDto = {
        task: 'test',
        isDone: 0,
      };

      jest.spyOn(todoService, 'create').mockRejectedValueOnce(new Error());

      expect(todoController.create(body)).rejects.toThrow();
    });
  });

  describe('show', () => {
    it('deve exibir os dados de uma task com sucesso', async () => {
      const result = await todoController.show('1');

      expect(result).toEqual(tododEntityList[0]);
      expect(todoService.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(todoService.findOneOrFail).toHaveBeenCalledWith('1');
    });

    it('deve lançar um erro quando show quebrar', () => {
      jest
        .spyOn(todoService, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      expect(todoController.show('1')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('deve atualizar o item todo com sucesso', async () => {
      const body: UpdateTodoDto = {
        task: 'task1',
        isDone: 1,
      };

      const result = await todoController.update('1', body);

      expect(result).toEqual(updatedTodoEntity);
      expect(todoService.update).toHaveBeenCalledTimes(1);
      expect(todoService.update).toHaveBeenCalledWith('1', body);
    });

    it('deve lançar um erro quando o update quebrar', () => {
      jest.spyOn(todoService, 'update').mockRejectedValueOnce(new Error());

      expect(todoController.update).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('deve deletar a task com sucesso', async () => {
      const result = await todoController.destroy('1');

      expect(result).toBeUndefined();
    });

    it('deve lançar uma exceção quando o delete falhar', () => {
      jest.spyOn(todoService, 'deleteById').mockRejectedValueOnce(new Error());

      expect(todoController.destroy).rejects.toThrow();
    });
  });
});
