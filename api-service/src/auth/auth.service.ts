import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { TokenDTO } from './dto/token.dto';
import { UserCredentialDTO } from './dto/user-credential.dto';
import { CreateUserDTO } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.getUserByEmail(email);
    const isPasswordMatching = user
      ? await bcrypt.compare(pass, user?.password)
      : false;

    if (isPasswordMatching) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(credentials: UserCredentialDTO): Promise<TokenDTO> {
    const fullUser = await this.usersService.getUserByEmail(credentials.email);
    const payload = {
      email: fullUser.email,
      id: fullUser['_id'],
      role: fullUser.role,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async register(user: CreateUserDTO): Promise<UserCredentialDTO> {
    try {
      const alredyExists = !!(await this.usersService.getUserByEmail(
        user.email,
      ));
      if (alredyExists) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const createdUser = await this.usersService.create(user);
      return { email: createdUser.email, password: createdUser.password };
    } catch (error) {
      throw error;
    }
  }
}
