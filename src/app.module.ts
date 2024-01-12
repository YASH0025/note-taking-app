import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule } from "@nestjs/config"
import { MailerModule } from '@nestjs-modules/mailer'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
import { errorFormatter } from './constants'
import { CommonFunctions } from './common/common_functions/commonfunctions'
import { TasksModule } from './tasks/tasks.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src\/schema.graphql',
      include: [AuthModule, UsersModule, TasksModule],
      playground: true,
      formatError: (err) =>errorFormatter(err)
    }),
    UsersModule,
    PassportModule,
    TasksModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.HOST,
        port: parseInt(process.env.HOST_PORT, 10),
        ignoreTLS: true,
        secure: true,
        auth: {
          user: process.env.HOST_USER,
          pass: process.env.HOST_PASSWORD
        },
      },
      defaults: {
        from: `"nest-modules" <${process.env.HOST_USER}>`,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TasksModule
  ],
  providers: [CommonFunctions]
})

export class AppModule { }
