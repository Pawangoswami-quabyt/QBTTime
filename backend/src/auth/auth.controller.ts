import { Controller, Get, Query, Res, UseGuards, Post, Body, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Public } from './public.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AzureAdService } from './azure.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private azureAdService: AzureAdService,
    private authService: AuthService,
  ) {}

  @Get('login')
  @Public()
  async login(@Res() res: Response) {
    const authUrl = await this.azureAdService.getAuthUrl();
    return res.redirect(authUrl);
  }

  @Get('redirect')
  @Public()
  async handleRedirect(@Query('code') code: string, @Res() res: Response) {
    const tokenResponse = await this.azureAdService.acquireTokenByCode(code);

    const profile = tokenResponse.account;
    if (!profile) {
      throw new UnauthorizedException('Failed to retrieve user profile');
    }

    // Validate and find or register the user
    const user = await this.authService.validateUser(
      profile.homeAccountId,
      profile.username,
      profile.name,
    );

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate a JWT token for the user
    const token = await this.authService.generateJwtToken(user);

    return res.json({ token });
  }

  @Post('register')
  @Public()
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return {
      message: 'User registered successfully',
      user,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return req.user;
  }
}
