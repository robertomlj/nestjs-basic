import { Token } from 'src/modules/token/entities/token.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  AfterLoad,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/modules/auth/roles/role.enum';

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

  @Column({ type: 'varchar', length: 60 })
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'text', array: true, default: [Role.User] })
  roles: Role[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @OneToMany(() => Token, (token) => token.user, {
    cascade: true,
  })
  tokens: Token[];

  private tempPassword: string;

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword(password: string) {
    if (this.tempPassword !== this.password) {
      const salt = await bcrypt.genSalt(10);

      this.password = await bcrypt.hash(password || this.password, salt);
    }
  }
}
