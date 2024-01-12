import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from '@nestjs/class-validator';
import { User } from '../entities/user.entity';
import * as mongoose from 'mongoose';
@ValidatorConstraint()
export class EmailAddressValidator implements ValidatorConstraintInterface {

  async validate(text: string, validationArguments: ValidationArguments) {
    
    const UserModel = mongoose.model<User>('Users')
    let user = await UserModel.findOne({
        email: text
      })
      if (user?.email && validationArguments.targetName === 'CreateAuthInput') return false
      return true
  }
}