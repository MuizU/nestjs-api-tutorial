import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // generate the pwd hash
    const { email, password } = dto;
    const hash = await argon.hash(password);
    // save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          hash,
        },
      });
      // return the saved user
      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
        throw error;
      }
      throw error;
    }
  }
  async signin(dto: AuthDto) {
    const { email, password } = dto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    // find the user by email
    // if the user is not found, throw an error
    if (!user) throw new ForbiddenException('User not found');

    // compare the password with the hash
    const { hash } = user;
    const pwdMatch = await argon.verify(hash, password);
    // if the password is not correct, throw an error
    if (!pwdMatch) throw new ForbiddenException('Invalid Credentials');

    // return the user
    delete user.hash;
    return user;
  }
}
