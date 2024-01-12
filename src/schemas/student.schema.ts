import * as mongoose from 'mongoose'



export const StudentSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    age: Number
  },
  { timestamps: true }
)
