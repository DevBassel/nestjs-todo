import { Exclude } from 'class-transformer';
import { Todo } from 'src/todos/entities/todo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}

export class ResponseUser {
  id: number;
  name: string;
  email: string;

  @Exclude()
  password: string;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
