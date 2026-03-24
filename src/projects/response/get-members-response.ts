import { ApiProperty } from "@nestjs/swagger";
import { RolesProject } from "../entities/role.entity";
import { User } from "src/users/entities/user.entity";

export class GetMembersResponse{
    @ApiProperty({example: RolesProject.admin})
    role:RolesProject

    @ApiProperty({
        example:{
            username:"nickname",
            firstName:"firstName",
            lastName:"lastName"
        }
    })
    user: Pick<User, 'username' | "firstName" | "lastName">
}