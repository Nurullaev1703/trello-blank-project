import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Users module is kept for TypeORM repository access in other modules.
// No public endpoints are exposed — user management goes through /auth/signup.
@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UsersController {}

