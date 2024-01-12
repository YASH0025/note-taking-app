import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { DatabaseModule } from '../common/database/database.module'
import { UsersProviders } from '../users/users.providers'
import { JwtModule } from '@nestjs/jwt'
import { MailerModule } from '@nestjs-modules/mailer'

import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
import { CommonFunctions } from '../common/common_functions/commonfunctions'


describe('AuthService', () => {

  let service: AuthService


  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [AuthService, ...UsersProviders,CommonFunctions],
    //   imports: [MailerModule.forRoot({
    //     transport: {
    //       host: process.env.HOST,
    //       port: process.env.HOST_PORT,
    //       ignoreTLS: true,
    //       secure: true,
    //       auth: {
    //         user: process.env.HOST_USER,
    //         pass: process.env.HOST_PASSWORD
    //       },
    //     },
    //     defaults: {
    //       from: `"nest-modules" <${process.env.HOST_USER}>`,
    //     },
    //     template: {
    //       dir: __dirname + '/templates',
    //       adapter: new EjsAdapter(),
    //       options: {
    //         strict: true,
    //       },
    //     },
    //   }),DatabaseModule,JwtModule.register({
    //     secret: '2zaud8GhCgtOjrytwuRlSDnMteHhdvGBhW3qCj911zy5hBanklDjWBSOXOZ4d2Lm',
    //     signOptions: { expiresIn: '9h' }
    //   })]
    // }).compile()

    // service = module.get<AuthService>(AuthService)
  })


  it('should be defined', () => {
    // expect(service).toBeDefined()
  })
})
