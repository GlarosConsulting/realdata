import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('customers_ixc')
export default class CustomerIXC {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ixc_id: string;

  @Column()
  ixc_name: string;

  @Column()
  conta_azul_name: string;

  @Column('bool')
  status: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
