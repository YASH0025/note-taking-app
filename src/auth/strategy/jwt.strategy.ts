import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { User } from '../../common/entities/user.entity'
import { UsersService } from '../../users/users.service'
import { jwtSecret } from '../constants'



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret
        })
    }

    async validate(payload: any) {
        const { email } = payload
        const query = { email: email }
        const user: any = await this.userService.findUser(query)

        if (!user) {
            throw new UnauthorizedException()
        }
        return user
    }
}