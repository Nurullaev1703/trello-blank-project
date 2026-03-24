import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal:true}),DatabaseModule, UsersModule, ProjectsModule, AuthenticationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
