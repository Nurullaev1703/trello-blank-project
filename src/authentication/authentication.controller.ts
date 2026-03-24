import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Authenticates a user and returns a JWT token.' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid credentials.' })
  signIn(@Body() signInDto: SignInDto) {
    return this.authenticationService.signIn(signInDto);
  }
  
  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'User registration', description: 'Registers a new user in the system.' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Validation failed.' })
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authenticationService.signUp(createUserDto);
  }

  @ApiBearerAuth()
  @Get('my')
  @ApiOperation({ summary: 'Get current user profile', description: 'Returns the profile information for the authenticated user.' })
  @ApiResponse({ status: 200, description: 'User profile details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMe(@Request() req: AuthRequest) {
    return this.authenticationService.getMe(req.user);
  }
}
