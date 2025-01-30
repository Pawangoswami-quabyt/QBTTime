import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('projects')
export class Project {
   @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

 @Column()
 description: string;

  @Column({type:'date'})
  startDate: Date;

   @Column({type:'date'})
  endDate: Date;

  @Column({ default: 'active' })
  status: string;

  @ManyToMany(() => User, user => user.assignedProjects)
  @JoinTable()
 assignedUsers: User[];

@CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
 updatedAt: Date;
  }