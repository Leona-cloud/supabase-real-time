import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services';
import { CreateUserDto } from '../dtos';

@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/create')
  async createUser(@Body() dto: CreateUserDto) {
    return await this.authService.createUser(dto);
  }
}
