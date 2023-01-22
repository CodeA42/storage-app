import User from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export default class Token {
  @PrimaryColumn({
    type: 'text',
    unique: true,
  })
  token: string;

  @Column({
    type: 'bigint',
  })
  exp: number;

  @Column({
    length: 24,
  })
  username: string;

  @Column({
    type: 'text',
  })
  userAgent: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({
    type: 'text',
  })
  userId: string;
}
