import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUserId } from 'src/decorators/getUserId.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@GetUserId() userId, @Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto, userId);
  }

  @Get()
  findAll(@GetUserId() userId: number) {
    return this.todosService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUserId() userId: number) {
    return this.todosService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUserId() userId: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(+id, userId, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUserId() userId: number) {
    return this.todosService.remove(+id, userId);
  }
}
