import { Controller, Post, Body, Req, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Public()
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60 } }) // 5 tentativas por minuto
  async login(@Body() body: any) {
    ////console.log("CHEGOU NO BACKEND");

    const user = await this.authService.validateUser(
      body.email,
      body.senha
    );

    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async register(@Body() body: any) {
    // Only allow ACS for public registration
    body.perfil = 'ACS';
    body.ativo = true;
    return this.authService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  buscar(@Req() req) {
    ////console.log(req.user);
    return "ok";
  }
}