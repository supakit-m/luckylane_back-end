import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ schema: 'luckylane_db', name: 'accounts' })
export class AccountsEntity {
  @PrimaryGeneratedColumn()
  accounts_id!: number;

  @Column()
  full_name!: string;

  @Column()
  name!: string;
  
  @Column()
  email!: string;

  @Column({ default: 'user' })
  role!: string;

  //system

  @Column({ type: 'tinyint', default: true })
  is_active!: boolean;

  @Column({ type: 'timestamp', precision: 0, nullable: true, default: null })
  create_date!: Date | null;

  @Column({ nullable: true, default: null })
  create_by!: string;

  @Column({ type: 'timestamp', precision: 0, nullable: true, default: null })
  update_date!: Date | null;

  @Column({ nullable: true, default: null })
  update_by!: string;
}