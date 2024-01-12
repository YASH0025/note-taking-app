import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) {
        super({
            clientID:
                '140312928219-aakdi00c3ucjulssrfhvioel4fbsieid.apps.googleusercontent.com',
            clientSecret: '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',
            // callbackURL: 'http://localhost:3000/account/verify/auth/google/callback',

            scope: ['email', 'profile',],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const user = {
            accessToken,
            refreshToken,
            profile,
            name: profile.displayName || 'Unknown',

        };
        console.log(user);
        // const savedUser = await this.authService.findOrCreateGoogleUser(user);

        

        return done(null, user)
    }
}
