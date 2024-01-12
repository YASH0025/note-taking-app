// auth.controller.ts

import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
// import { AuthGuard } from '@nestjs/passport';

// 'account/verify
@Controller('account/verify')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }
  @Get(':token')
  async verifyUser(@Param('token') token: string, @Res() res): Promise<any> {
    const message = await this.authService.verifyUser(token)
    res.header('Content-Type', 'text/html')
    return res.send(message);
  }



  // @Get('auth/google/callback')
  // @UseGuards(AuthGuard('google'))
  // async googleLoginCallback(@Req() req, @Res() res) {
  //   // try {
  //   const user = req.user;

  //   await this.authService.findOrCreateGoogleUser(user);
  //   res.send({ message: 'Google login successful!' });
  //   // } catch (error) {
  //   //   console.error(error);
  //   //   res.redirect('/error');
  //   // }
  // }

  // @Get('facebook')
  // @UseGuards(AuthGuard('facebook'))
  // async facebookLogin(): Promise<void> {
  // }

  // @Get('auth/facebook/callback')
  // @UseGuards(AuthGuard('facebook'))
  // async facebookLoginCallback(@Req() req, @Res() res): Promise<void> {

  //   const user = req.user;
    
  //   await this.authService.findOrCreateFacebookUser(user);
  //   res.send({ message: 'Facebook login successful!' });
  // }

  @Get()
  handleRoot() {
    return 'Welcome to the NestJS application!';
  }
}
