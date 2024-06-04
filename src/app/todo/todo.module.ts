import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService],
  exports: [TodoService], // Para utilizar a implementação do TodoService em outros módulos.
})
export class TodoModule {}
