import { User } from 'src/modules/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  type: string;

  @ManyToOne((type) => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  user: User;
}
