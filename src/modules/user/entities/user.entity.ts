import { Token } from 'src/modules/token/entities/token.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: 'user' })
  accessLevel: string;

  @OneToMany(() => Token, (token) => token.user, {
    cascade: ['insert'],
  })
  @JoinTable()
  tokens: Token[];

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();

    this.password = await bcrypt.hash(password || this.password, salt);
  }
}
