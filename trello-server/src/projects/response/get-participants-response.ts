import { ApiProperty } from "@nestjs/swagger";

export class GetParticipantsResponse{
    @ApiProperty({example:"Имя"})
    firstName:string = ""

    @ApiProperty({example:"Фамилия"})
    lastName:string = ""

    @ApiProperty({example:"username"})
    username:string = ""
}