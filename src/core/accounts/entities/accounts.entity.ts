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
  surname!: string;
  
  @Column({ unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  google_id!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  picture!: string | null;

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