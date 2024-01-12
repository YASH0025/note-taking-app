import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { HttpStatus, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service'
import { Data } from '../../common/entities/user.entity'


export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authservice: AuthService) {
        super()
    }

    async validate(email: string, password: string): Promise<Data> {
        const user = await this.authservice.signInUser({ email: email, password: password})
        if (user.statusCode !== HttpStatus.OK) {
            throw new UnauthorizedException()
        }
        return user as Data
    }
}