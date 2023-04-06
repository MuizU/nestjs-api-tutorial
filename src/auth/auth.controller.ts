import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ParseIntPipe } from '@nestjs/common';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    const { email, password } = dto;
    console.log({
      email,
      typeOfEmail: typeof email,
      typeofPwd: typeof password,
      password,
    });
    return this.authService.signup();
  }
  @Post('signin')
  signin() {
    return this.authService.signin();
  }
}
