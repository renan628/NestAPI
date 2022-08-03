import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as passwordGenerator from 'generate-password';
import { CreateUserDTO } from './dto/create-user.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private mailService: MailerService,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(user: CreateUserDTO): Promise<User> {
    const password = this.generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await this.userModel.create({
      ...user,
      password: hashedPassword,
    });
    createdUser.password = password;
    return createdUser;
  }

  async resetPassword(email: string): Promise<string> {
    try {
      const alredyExists = !!(await this.getUserByEmail(email));
      if (!alredyExists) {
        throw new HttpException("User doesn't exist", HttpStatus.BAD_REQUEST);
      }
      const newPassword = this.generatePassword();

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userModel
        .updateOne(
          { email },
          {
            password: hashedPassword,
          },
        )
        .exec();

      await this.mailService.sendMail({
        to: email,
        from: 'App Team <appteam@jobsity.com>',
        subject: 'Password reset',
        text: `Hello, your new password for our service is "${newPassword}"`,
      });
      return 'Sending email with new password';
    } catch (error) {
      throw error;
    }
  }

  private generatePassword(): string {
    return passwordGenerator.generate({
      numbers: true,
      length: 10,
    });
  }
}
