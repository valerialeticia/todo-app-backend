import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IndexTodoSwagger } from './swagger/index-todo.swagger';
import { CreateTodoSwagger } from './swagger/create-todo.swagger';
import { ShowTodoSwagger } from './swagger/show-todo.swagger';
import { UpdateTodoSwagger } from './swagger/update-todo.swagger';
import { BadRequestSwagger } from 'src/helpers/swagger/bad-request.swagger';
import { NotFoundSwagger } from 'src/helpers/swagger/not-found.swagger';

@Controller('api/v1/todos')
@ApiTags('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get() // endpoint do tipo get, no qual vai retornar todos os todos.
  @ApiOperation({ summary: 'Listar todas as tarefas' }) // adiciona descrição para a api
  @ApiResponse({
    status: 200,
    description: 'Lista de tarefas retornada com sucesso',
    type: IndexTodoSwagger, // descrição para retorno da api.
    isArray: true,
  }) // documenta sobre a response do endpoint
  async index() {
    return await this.todoService.findAll();
  }

  @Post() // endpoint do tipo post, no qual irá criar o todo.
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  @ApiResponse({
    status: 201,
    description: 'Nova tarefa criada com sucesso',
    type: CreateTodoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos',
    type: BadRequestSwagger,
  })
  async create(@Body() body: CreateTodoDto) {
    return await this.todoService.create(body);
  }

  @Get(':id') // endpoint também do tipo get mas que irá precisar passar um id para resgatar o todo oferecido.
  @ApiOperation({ summary: 'Exibir os dados de uma tarefa' })
  @ApiResponse({
    status: 200,
    description: 'Dados de uma tarefa retornados com sucesso',
    type: ShowTodoSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não foi encontrada',
    type: NotFoundSwagger,
  })
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.todoService.findOneOrFail(id);
  }

  @Put(':id') // endpoint do tipo put, que irá receber um id e precisar de um payload para assim atualizar o todo.
  @ApiOperation({ summary: 'Atualizar os dados de uma tarefa' })
  @ApiResponse({
    status: 200,
    description: 'Tarefa atualizada com sucesso',
    type: UpdateTodoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não foi encontrada',
    type: NotFoundSwagger,
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTodoDto,
  ) {
    return await this.todoService.update(id, body);
  }

  @Delete(':id') // endpoint do tipo delete que irá precisar de um id para deletar o todo.
  @ApiOperation({ summary: 'Remover uma tarefa' })
  @ApiResponse({ status: 204, description: 'Tarefa removida com sucesso' })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não foi encontrada',
    type: NotFoundSwagger,
  })
  @HttpCode(HttpStatus.NO_CONTENT) // aqui irá forçar qual código HTTP irá retornar para o client, podendo receber 204 ou o enum oclocado.
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.todoService.deleteById(id);
  }
}
