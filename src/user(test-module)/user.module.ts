import { Module } from '@nestjs/common';
import { UserCreatedHandler } from './application/outbox-handler/user-created.handler';
import { CreateUserUseCase } from './application/use-cases/create-user/create-user.use-case';
import { UserController } from './infrastructure/http/user.controller';
import { OutboxModule } from '../infrastructure/outbox/outbox.module';

@Module({
  imports: [OutboxModule],
  providers: [UserCreatedHandler, CreateUserUseCase],
  controllers: [UserController],
})
export class UserModule {}
