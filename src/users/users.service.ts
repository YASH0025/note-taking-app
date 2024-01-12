import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { OTPValidation, ResetPasswords, UpdatePasswords, UpdateUserInput } from './dto/update-user.input'
import { Email, Message, User } from '../common/entities/user.entity'
import { CommonMongooseFunctions } from '../common/common_functions/commonMongooseQuries'
import { CONSTANTS } from '../constants'

import { CommonFunctions } from '../common/common_functions/commonfunctions'
import { PaginatedResponse, PaginationtInput } from '../common/entities/pagination.input'
import { RemoveUserInput } from 'src/auth/dto/create-auth.input'


@Injectable()
export class UsersService {


  private mongooseFunction: CommonMongooseFunctions<any>

  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    private readonly commonFunctions: CommonFunctions
  ) {
    this.mongooseFunction = new CommonMongooseFunctions<any>(this.userModel)
  }

  /// find all users available
  async findAll() {
    const result = await this.mongooseFunction.findAll()
    return result
  }


  /// find user by email/_id
  async findUser(UserInfo: Object) {
    const query = UserInfo
    const user = await this.mongooseFunction.findOne(query)
    return user as User
  }


  async update(userId: string, updateUserInput: UpdateUserInput) {
    const updationValue = Object.entries(updateUserInput).reduce((acc, [key, value]) => {
      if (value) acc[key] = value
      return acc
    }, {})
    const user = await this.mongooseFunction.updateOne({ _id: userId }, updationValue)

    return user as User
  }

  /// this function can delete single user at a time
  async remove(user: any) {
    let message: {}
    const result = await this.mongooseFunction.deleteOne({ _id: user?._id })
    if (result) {
      message = {
        message: CONSTANTS.USER_DELETE_SUCCESS,
        statusCode: HttpStatus.OK
      } as Message
      return message
    } else {
      message = {
        message: CONSTANTS.USER_DELETE_ERROR,
        statusCode: HttpStatus.FORBIDDEN
      } as Message
      return message
    }
  }


  /// It will generate otp by passing email id for forgot password by providing email
  // async generateOTP(data: any): Promise<Message> {
  //   const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
  //   let message: {}
  //   const value = await this.mongooseFunction.updateOne({ email: data.email }, {
  //     otp: generatedOtp,
  //     otpGenerateTime: new Date().getTime()
  //   })

  //   if (value && value?.otp) {
  //     const mailData = {
  //         to: value?.email,
  //         from: process.env.HOST_USER,
  //         subject: CONSTANTS.FORGOT_PASSWORD_SUBJECT,
  //         html: `Your otp to reset password is ${value?.otp}`
  //       }
  //      await this.commonFunctions.sendEmail(mailData)
  //       .then(() => {
  //         message = {
  //           statusCode: HttpStatus.OK,
  //           message: CONSTANTS.OTP_ON_EMAIL
  //         }
  //       })
  //       .catch(() => {
  //         message = {
  //           statusCode: HttpStatus.NOT_MODIFIED,
  //           message: CONSTANTS.UNKNOWN_ERROR
  //         }
  //       });
  //   } else {
  //     message = {
  //       statusCode: HttpStatus.NOT_MODIFIED,
  //       message: CONSTANTS.UNKNOWN_ERROR
  //     }

  //   }
  //   return message as Message
  // }


  //Forgot password email sent to registered user

  async forgotPassword(data: any): Promise<Message> {
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    let message: {}
    const value = await this.mongooseFunction.updateOne({ email: data.email }, {
      otp: generatedOtp,
      otpGenerateTime: new Date().getTime()
    })

    if (value && value?.otp) {
      const path = 'src\/templates\/forgotPasswordTemplate.ejs'
      const html = await this.commonFunctions.renderWithData({ user: value, link: `${process.env.LOCAL_DOMAIN_NAME}reset-password/${value.otp}`, appName: process.env.APP_NAME }, path)
      const mailData = {
        to: value?.email,
        subject: `${CONSTANTS.FORGOT_PASSWORD_SUBJECT} ${process.env.APP_NAME}`,
        html: html
      }
      await this.commonFunctions.sendEmail(mailData)
        .then(() => {
          message = {
            statusCode: HttpStatus.OK,
            message: CONSTANTS.OTP_ON_EMAIL
          }
        })
        .catch(() => {
          message = {
            statusCode: HttpStatus.NOT_MODIFIED,
            message: CONSTANTS.UNKNOWN_ERROR
          }
        });
    } else {
      message = {
        statusCode: HttpStatus.NOT_MODIFIED,
        message: CONSTANTS.UNKNOWN_ERROR
      }

    }
    return message as Message
  }


  ///this function validate otp for forgot password
  async validateOtpToken(data: OTPValidation): Promise<Message> {
    let message: {}
    if (data && data?.otp) {
      let query = {
        email: data.email
      }
      const value = await this.mongooseFunction.findOne(query)
      if (value?.otp !== data?.otp) {
        message = {
          statusCode: HttpStatus.OK,
          message: 'Invalid OTP',
        }
        return message as Message
      }

      const isOtpExpired = await this.commonFunctions.checkIfTimeExpired(value.otpGenerateTime)

      if (!isOtpExpired)
        message = {
          statusCode: HttpStatus.OK,
          message: 'OTP validated successfully',
        }
      else
        message = {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'OTP has expired',
        }
      return message as Message
    } else {
      message = {
        statusCode: HttpStatus.NOT_MODIFIED,
        message: CONSTANTS.UNKNOWN_ERROR
      }
      return message as Message
    }
  }


  ///this function reset password if otp is verified and current and old passwords are same
  async resetPassword(data: ResetPasswords): Promise<Message> {
    const { email, newPassword, confirmPassword, token } = data
    if (newPassword !== confirmPassword) {
      return this.createMessage(HttpStatus.FORBIDDEN, CONSTANTS.PASSWORD_IDENTICAL_ERROR_MESSAGE)
    }

    const user = await this.mongooseFunction.findOne({ email })

    if (!user) {
      return this.createMessage(HttpStatus.FORBIDDEN, CONSTANTS.EMAIL_NOT_FOUND)
    }

    const isValidTime = await this.mongooseFunction.checkIfTimeExpired(user.otpGenerateTime)

    if (isValidTime && user.otp === token) {
      return this.createMessage(HttpStatus.FORBIDDEN, CONSTANTS.NOT_A_VALID_REQUEST)
    }

    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(newPassword, salt)

    const query = { email }
    const result = await this.mongooseFunction.updateOne(query, { password: hashPassword })

    return result
      ? this.createMessage(HttpStatus.OK, CONSTANTS.PASSWORD_UPDATED_SUCCESSFULLY)
      : this.createMessage(HttpStatus.FORBIDDEN, CONSTANTS.UNKNOWN_ERROR)
  }


  ///this function can update password if user is loggedin
  async updatePassword(userValue: any, data: UpdatePasswords): Promise<Message> {
    let message: {}

    if (data.newPassword === data.confirmPassword) {
      const hashPassword = await bcrypt.compare(
        data.oldPassword,
        userValue.password
      )
      if (!hashPassword) {
        message = {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Incorrect current password'
        }
        return message as Message
      }
      const salt = await bcrypt.genSalt()
      const newPaass = await bcrypt.hash(data.newPassword, salt)
      const update = this.mongooseFunction.updateOne({ _id: userValue._id }, { password: newPaass })

      if (update) {
        message = {
          statusCode: HttpStatus.OK,
          message: CONSTANTS.PASSWORD_UPDATED_SUCCESSFULLY
        }
        return message as Message
      }
    } else {
      message = {
        statusCode: HttpStatus.FORBIDDEN,
        message: CONSTANTS.PASSWORD_IDENTICAL_ERROR_MESSAGE
      }
      return message as Message
    }
    return
  }


  async findByPagination(paginate: PaginationtInput) {
    const data = await this.mongooseFunction.findByPagination(paginate.page, paginate.limit)
    return data as PaginatedResponse
  }

  //This function renders ejs file for dynamic templates and data in it
  // async renderWithData(data: Record<string, any>, path: any) {
  //   const template = await fs.readFileSync(path, 'utf-8');
  //   const rendered = await ejs.render(template, data);
  //   return rendered;
  // }

  private createMessage(statusCode: number, message: string): Message {
    return { statusCode, message };
  }


  // async remove(removeUser: RemoveUserInput) {

  //   let user: any
  //   user = await this.mongooseFunction.deleteOne({ userName: removeUser.userName })

  //   return {
  //     message: 'User removed',
  //     statusCode: 200
  //   } as Message
  // }

  

  // async saveOrUpdateUser(user: any): Promise<User> {
  //   // const existingUser = await this.userModel.findOne({  }).exec();
  //   const existingUser = await this.mongooseFunction.findOne({ email: user.email })


  //   if (existingUser) {
  //     existingUser.fullName = user.displayName;

  //     return existingUser.save();
  //   } else {
  //     const newUser = new this.userModel({
  //       email: user.email,
  //       fullName: user.displayName, 
  //     });

  //     return newUser.save();
  //   }
  // }




}
