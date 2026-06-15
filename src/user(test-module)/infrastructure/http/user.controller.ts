import { Controller, Get,  } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user/create-user.use-case';

@Controller('user')
export class UserController {
  constructor(private readonly createUser: CreateUserUseCase) {}

  @Get('')
  async createUserTest() {
    await this.createUser.execute();

    return new Date().toISOString();
  }

}
