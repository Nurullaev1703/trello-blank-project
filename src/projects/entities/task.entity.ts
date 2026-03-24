import { AbstractEntity } from "src/abstractions/abstract.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { Project } from "./project.entity";

export enum TaskStatus{
    create = "create",
    inProgress = "inProgress",
    done = "done"
}

@Entity()
export class Task extends AbstractEntity<Task> {
    @Column()
    title:string

    @Column()
    startDate:string

    @Column()
    endDate:string

    @Column()
    status:TaskStatus

    @ManyToOne(() => User)
    user:User

    @ManyToOne(() => Project)
    project:Project
}
