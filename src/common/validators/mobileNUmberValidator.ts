import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from '@nestjs/class-validator';
import { User } from '../entities/user.entity';
import * as mongoose from 'mongoose';
@ValidatorConstraint()
export class MobileNumberValidator implements ValidatorConstraintInterface {

  async validate(text: string, validationArguments: ValidationArguments) {
    const regex = /^(?:\+|\d)[0-9]{6,14}$/
    
    return regex.test(text)
  }
}