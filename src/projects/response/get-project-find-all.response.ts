import { ApiProperty } from "@nestjs/swagger";

export class GetProjectFindAllResponse{
    @ApiProperty({example:"hdsj321-fjsdk321-fdsj21"})
    id:string

    @ApiProperty({example:"Название проекта"})
    name:string
}