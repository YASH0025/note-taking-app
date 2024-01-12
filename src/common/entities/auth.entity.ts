import { ObjectType, Field, Int } from '@nestjs/graphql'



@ObjectType()
export class Auth {
  
  @Field(() => String,{nullable:true})
  email: string

  @Field(() => String)
  _id: string
}
