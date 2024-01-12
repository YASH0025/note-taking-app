import { IsEmail, IsNotEmpty, IsString, Length, IsBoolean, Validate, Matches } from '@nestjs/class-validator'
import { InputType, Field, Int } from '@nestjs/graphql'
import { IsStrongPassword } from 'class-validator'
import { CONSTANTS } from '../../constants'
import { CommonValidator } from '../../common/validators/CommonValidator'
import { Email } from '../../common/entities/user.entity'
import { MobileNumberValidator } from 'src/common/validators/mobileNUmberValidator'



@InputType()
export class SignInAuthInput extends Email {

  @Field((type) => String)
  @IsString()
  @Length(8, 30)
  @Matches(/^\S*$/, { message: CONSTANTS.PASSWORD_WHITE_SPACE_MESSAGE })
  @IsStrongPassword({}, { message: CONSTANTS.STRONG_PASSWORD })
  password: string

}


@InputType()
export class CreateAuthInput extends SignInAuthInput {

  @Field((type) => String)
  @IsString()
  @Length(3, 50, { message: CONSTANTS.ENTER_FULLNAME })
  @Matches(/^([A-Z][a-z]+(?: [A-Za-z]+)*)$/, { message: CONSTANTS.FULLNAME_INVALID_MESSAGE })
  fullName: string
}


@InputType()
export class RemoveUserInput {
  @Field((type) => String)
  @IsString()
  @Length(6, 30)
  email: string
}
