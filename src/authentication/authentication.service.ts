import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ){}

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOne({
      where:{
        username: signInDto.username
      }
    })

    if(!user){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    
    const isMatch = await bcrypt.compare(signInDto.password, user.password)

    if(!isMatch){
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED)
    }

    const payload:TokenData = {id:user.id}
    const token = await this.jwtService.signAsync(payload)

    return { token };
  }
  async signUp(signUp: CreateUserDto) {
    const userExist = await this.userRepository.count({
      where:{
        username: signUp.username
      }
    })
    if(userExist) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.CONFLICT
      )
    }

    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(signUp.password,salt)

    const user = new User({...signUp, password:hash})
    await this.userRepository.save(user)
    return "User successfully registered";
  }

  async getMe(tokenData: TokenData) {
    const user = await this.userRepository.findOne({
      where: { id: tokenData.id }
    });
    
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
