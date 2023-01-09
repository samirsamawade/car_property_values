import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';



@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.userService.find(email);

    if (users.length) {
      throw new BadRequestException('Email already in use');

      
    }
  }

  signin(){}
}