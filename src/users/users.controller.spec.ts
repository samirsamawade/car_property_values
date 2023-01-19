import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;

  let fakeAuthService: Partial<AuthService>;
  let fakeusersService: Partial<UsersService>;

  beforeEach(async () => {

    fakeAuthService ={

    }

    fakeusersService = {

    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService
        },
        {
          provide: UsersService,
          useValue: fakeusersService,
        },
        
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
