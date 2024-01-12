import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { TasksProviders } from './tasks.providers'
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from '../auth/constants';
import { DatabaseModule } from '../common/database/database.module';
import { CommonFunctions } from '../common/common_functions/commonfunctions';

@Module({
  imports: [DatabaseModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '9h' }
    })
  ],
  providers: [TasksService, TasksResolver, ...TasksProviders, CommonFunctions]
})
export class TasksModule { }
