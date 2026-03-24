import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/entities/user.entity";
import { Project } from "../entities/project.entity";
import { TaskStatus } from "../entities/task.entity";

export class GetTasksReponse{
    @ApiProperty({example: "Создать дизайн"})
    title:string
    
    @ApiProperty({example:"2024-05-20T00:00:00+06:00"})
    startDate:string

    @ApiProperty({example:"2024-05-20T00:00:00+06:00"})
    endDate:string

    @ApiProperty({example:{
        username:" testNick",
        firstName: "Петр",
        lastName: "Петров"
    }})
    user: Pick<User, "username" | "firstName" | "lastName">

    @ApiProperty({
        example:{
            id: "5dercsfjd-85b1-4433-8721-fdshj2321s",
            name: "Название проекта"
        }
    })
    project: Project

    @ApiProperty({enum: TaskStatus})
    status: TaskStatus
}