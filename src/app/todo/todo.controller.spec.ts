import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

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
            findAll: jest.fn(),
            create: jest.fn(),
            findOneOrFail: jest.fn(),
            update: jest.fn(),
            deleteById: jest.fn(),
          },
        },
      ], // mockando lista de providers
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('index', () => {
    it('deve retornar a todolist Entity com sucesso', async () => {
      const result = await todoController.index();

      expect(result).toEqual([]);
    });
  });
});
