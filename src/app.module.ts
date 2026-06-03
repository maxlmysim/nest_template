import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { OutboxModule } from './infrastructure/outbox/outbox.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user(test-module)/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    OutboxModule,
    UserModule,
  ],
})
export class AppModule {}
