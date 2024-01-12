import { Connection } from 'mongoose'
import { TaskSchema } from '../schemas/tasks.schema'



export const TasksProviders = [
  {
    provide: 'TASKS_MODEL',
    useFactory: (connection: Connection) => connection.model('Tasks', TaskSchema),
    inject: ['DATABASE_CONNECTION']
  }
]