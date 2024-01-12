import { Connection } from 'mongoose'
import { UsersSchema } from '../schemas/users.schema'



export const UsersProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: async(connection: Connection) => await connection.model('Users', UsersSchema),
    inject: ['DATABASE_CONNECTION']
  }
]