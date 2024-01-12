import { IsNotEmpty, IsString, IsEmail, Validate } from '@nestjs/class-validator'
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql'
import { CONSTANTS } from '../../constants'
import { CommonValidator } from '../validators/CommonValidator'



@ObjectType()
export class User {
  @Field((type) => String, { defaultValue: '' })
  fullName: string

  @Field((type) => String, { defaultValue: '' })
  email: string
}

@InputType()
export class UserFind {

  @Field((type) => String, { nullable: true })
  fullName: string

  @Field((type) => String, { nullable: true })
  email: string

  @Field((type) => String, { nullable: true })
  _id: string

}


@ObjectType()
export class UserAuthentication extends User {
  @Field((type) => String, { defaultValue: '' })
  password: string
}


@ObjectType()
export class Message {
  @Field((type) => String, { defaultValue: '', nullable: true })
  message: string

  @Field((type) => Int, { nullable: true })
  statusCode: number
}


@ObjectType()
export class Authentication extends User {

  @Field((type) => String, { nullable: true })
  auth_token: string
}

@ObjectType()
export class Data extends Message {
  @Field((type) => Authentication, { nullable: true })
  user: Authentication

  //   @Field((type) => Message, { nullable: true })
  // Message
}

@InputType()
export class Email {
  @Field((type) => String)
  @IsNotEmpty({ message: CONSTANTS.EMAIL_NOT_EMPTY })
  @IsString({ message: CONSTANTS.EMAIL_VALID })
  @IsEmail({}, { message: CONSTANTS.EMAIL_VALID })
  @Validate(CommonValidator, {
    message: CONSTANTS.EMAIL_EXISTS
  })
  email: string
}
