import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTUserDTO } from '../dto/jwt-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTSECRET,
      usernameField: 'email',
    });
  }

  async validate(payload): Promise<JWTUserDTO> {
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
