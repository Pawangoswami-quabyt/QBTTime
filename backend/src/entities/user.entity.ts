import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TimeEntry } from './time-entry.entity';
import { Project } from './project.entity';

@Entity('users')
export class User {
    @PrimaryColumn()
    id: string; // Azure AD Object ID

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column({ type: 'varchar', default: 'employee' })
    role: string;

    @OneToMany(() => Project, project => project.assignedUsers)
    assignedProjects: Project[];

    @OneToMany(() => TimeEntry, timeEntry => timeEntry.user)
    timeEntries: TimeEntry[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}