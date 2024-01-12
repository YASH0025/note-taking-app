import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
    super({
      clientID: '1564274897054523',
      // clientID: '844753532230816',
      // clientSecret: '8a9a694397230c9ccbe2104ec895a5ec',
      clientSecret: '1b17d3d08887329d18aedc7a9f410544',
      callbackURL: 'http://localhost:3000/account/verify/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'emails'],
      scope: ['email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // console.log(profile);
    
    const user = {
      facebookId: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value,
      accessToken : _accessToken
    //   photoUrl: profile.photos[0].value,
    };

    return done(null, user);
  }
}
