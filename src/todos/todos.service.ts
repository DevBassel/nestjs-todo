import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { EntityManager } from 'typeorm';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(private readonly entityManager: EntityManager) {}

  create(createTodoDto: CreateTodoDto, userId: any) {
    console.log(createTodoDto);

    return this.entityManager.save(Todo, {
      content: createTodoDto.content,
      userId,
    });
  }

  findAll(userId: number) {
    return this.entityManager.findBy(Todo, { userId });
  }

  findOne(id: number, userId: number) {
    return this.entityManager.findBy(Todo, { id, userId });
  }

  async update(id: number, userId: number, updateTodoDto: UpdateTodoDto) {
    console.log(updateTodoDto);
    const todo = await this.entityManager.findOneBy(Todo, { id, userId });

    if (!todo) throw new NotFoundException('not found todo');

    return this.entityManager.save(Todo, {
      ...todo,
      content: updateTodoDto.content,
    });
  }

  async remove(id: number, userId: number) {
    const todo = await this.entityManager.findOneBy(Todo, { id, userId });

    if (!todo) throw new NotFoundException('not found todo');

    return this.entityManager.delete(Todo, { id, userId });
  }
}
