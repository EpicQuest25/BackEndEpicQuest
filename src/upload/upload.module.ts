import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilePicture } from './entities/profilepicture.entity';
import { AuthenticationModule } from '../authentication/authentication.module';
import { User } from '../user/entities/user.entity';
import { Agent } from '../agent/entities/agent.entity';
import { Supplier } from '../supplier/entities/supplier.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfilePicture, User, Agent, Supplier]),
    AuthenticationModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}