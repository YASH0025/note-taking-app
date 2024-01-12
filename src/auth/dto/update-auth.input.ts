import { IsString, Length } from '@nestjs/class-validator'
import { InputType, Field, Int, PartialType } from '@nestjs/graphql'
import { IsStrongPassword } from 'class-validator'
import { CreateAuthInput } from './create-auth.input'
import { CONSTANTS } from '../../constants'



@InputType()
export class UpdateAuthInput extends PartialType(CreateAuthInput) {
  @Field(() => Int)
  id: number
}


@InputType()
export class LoginAuth {
  
  @Field((type) => String, {defaultValue:'', nullable: true })
  email: string
  
  @Field((type) => String)
  @IsString()
  @Length(8, 30)
  @IsStrongPassword({}, { message: CONSTANTS.STRONG_PASSWORD })
  password: string
}