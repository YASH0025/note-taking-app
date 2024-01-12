import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { DatabaseModule } from '../common/database/database.module'
import { UsersProviders } from '../users/users.providers'
import { jwtSecret } from './constants';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './strategy/jwt.strategy'
import { LocalStrategy } from './strategy/local.strategy'
import { UsersService } from '../users/users.service'
import { AuthController } from './auth.controller'
import { CommonFunctions } from '../common/common_functions/commonfunctions'
import { GoogleStrategy } from './strategy/google.strategy'
import { FacebookStrategy } from './strategy/facebook.strategy'
import { GoogleVerificationService } from './verify-googleuser'
import { FacebookVerificationService } from './verify-facebookuser'
// import { UsersModule } from 'src/users/users.module'
// import { GoogleStrategy } from './google.strategy'


@Module({
  imports: [DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        signOptions: { expiresIn: '9h' },
        secret: jwtSecret
      })
    }),
  ],
  controllers: [AuthController],
  providers: [UsersService, AuthResolver, AuthService, ...UsersProviders, JwtStrategy, LocalStrategy, CommonFunctions, GoogleStrategy,FacebookStrategy,GoogleVerificationService,FacebookVerificationService],
})

export class AuthModule { }
