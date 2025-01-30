import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

    @Entity('time_entries')
    export class TimeEntry {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ type: 'date' })
      date: Date;

      @Column({ type: 'time' })
      startTime: string;

      @Column({ type: 'time' })
      endTime: string;

      @Column({ type: 'text' })
     description: string;

       @Column({ type: 'varchar', length: 100 })
       project: string;

      @Column({ type: 'boolean', default: false })
      submitted: boolean;
      @Column({type: 'varchar', default: 'draft'})
       status: string;

      @ManyToOne(() => User, user => user.timeEntries)
     user: User;

       @Column()
       userId: string;

      @CreateDateColumn()
      createdAt: Date;

     @UpdateDateColumn()
     updatedAt: Date;
    }