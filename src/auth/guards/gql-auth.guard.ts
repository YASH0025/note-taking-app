// import { Injectable, ExecutionContext } from '@nestjs/common'
// import { GqlExecutionContext } from '@nestjs/graphql'
// import { AuthGuard } from '@nestjs/passport'

// @Injectable()
// export class GqlAuthGuard extends AuthGuard('jwt') {
//     constructor() {
//         super()
//     }

//     getRequest(context: ExecutionContext) {
//         const ctx = GqlExecutionContext.create(context)
//         return ctx.getContext().req
//     }
// }

import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

// import { verifyGoogleAccessToken } from '../verify-googleuser';
import * as jwt from 'jsonwebtoken';
import { GoogleVerificationService } from '../verify-googleuser';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { FacebookVerificationService } from '../verify-facebookuser';

import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { CONSTANTS } from '../../constants'

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super()
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext()

    if (!req) throw new UnauthorizedException('No request object in context')

    return req
  }


  private verifyToken(token: string): Observable<boolean> {
    return of(token).pipe(
      switchMap((googleAccessToken: string) => this.verifyTokenAsync(googleAccessToken)),
      catchError(() => of(false)),
      map(isValid => isValid && true) // You can modify this as needed
    );
  }

  private async verifyTokenAsync(token: string): Promise<boolean> {
    try {
      const isValid = await GoogleVerificationService.verifyAccessToken(token);
      console.log(isValid.data);

      return isValid;

    } catch (error) {
      console.error('Error verifying Google Access Token:', error.message);
      return false;
    }
  }
  private verifyFacebookToken(token: string): Observable<boolean> {
    return of(token).pipe(
      switchMap((facebookAccessToken: string) => this.verifyFacebookTokenAsync(facebookAccessToken)),
      catchError(() => of(false)),
      map(isValid => isValid && true)
    );
  }

  private async verifyFacebookTokenAsync(token: string): Promise<boolean> {
    try {
      const isValid = await FacebookVerificationService.verifyAccessToken(token);
      console.log(isValid);

      return isValid;
    } catch (error) {
      console.error('Error verifying Facebook Access Token:', error.message);
      return false;
    }
  }

  canActivate(context: ExecutionContext): Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    if (!req) throw new UnauthorizedException('No request object in context')

    const jwtToken = req.headers.authorization?.split(' ')[1];
    const googleToken = req.headers['x-google-access-token'];
    const facebookToken = req.headers['x-facebook-access-token'];
    console.log(googleToken);
    

    console.log(req.headers['x-google-access-token']);


    if (jwtToken) {
      return super.canActivate(context) as Observable<boolean>;
    } else if (googleToken) {
      return this.verifyToken(googleToken);
    } else if (facebookToken) {
      return this.verifyFacebookToken(facebookToken);
    }


    return of(false);
  }

  handleRequest(err, user, info) {
    if (err || !user) throw err || new UnauthorizedException(CONSTANTS.UNAUTHORISED_ACCESS)
    return user
  }



}
