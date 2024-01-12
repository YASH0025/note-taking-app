import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from '@nestjs/class-validator'
import { User } from '../entities/user.entity'
import * as mongoose from 'mongoose'



@ValidatorConstraint()
export class CommonValidator implements ValidatorConstraintInterface {

  async validate(text: string, validationArguments: ValidationArguments) {  
    const targetName: string = validationArguments.property
    const query: Record<string, string> = {[targetName]: text}
    const UserModel = mongoose.model<User>('Users')
    let user = await UserModel.findOne(query)
      if (user?.[targetName] && validationArguments.targetName === 'CreateAuthInput') return false
      return true
  }
}