import { PrismaService } from '@/modules/core/prisma/services';
import { CreateUserDto } from '../dtos';
import { generateIdentifier } from '@/utils';
import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async createUser(options: CreateUserDto) {
    const hashPassword = await bcrypt.hash(options.password, 10);

    await this.prisma.user.create({
      data: {
        identifier: generateIdentifier({ type: 'identifier' }),
        firstName: options.firstName,
        lastName: options.lastName,
        password: hashPassword,
      },
    });

    return {message: 'User created successfully'}
  }
}
