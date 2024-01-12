import * as mongoose from 'mongoose'



const MONGO_URI = 'mongodb://0.0.0.0:27017/nest'

export const databaseProvider = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(MONGO_URI)
  }
]