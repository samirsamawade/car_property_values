import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { find } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {

    fakeAuthService ={
      signin: (email: string, password: string)=>{
        return Promise.resolve({id: 1, email, password} as User);
      }
    }

    fakeUsersService = {
      findOne: (id: number)=>{
        return Promise.resolve({id, email: "asdf@asdf.com", password:"asdf"} as User)
      },

      find: (email: string)=>{
        return Promise.resolve([{id:1, email, password: "12345"} as User])
      }

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
          useValue: fakeUsersService,
        },
        
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async ()=>{
    const users= await controller.findAllUsers("asdf@asdf.com");
    expect( users.length).toEqual(1);
    expect(users[0].email).toEqual("asdf@asdf.com");
  });

  it("findUser returns a single user with a given id", async()=>{
    const user = await controller.findUser("1");
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns a user', async()=>{
    const session = {userId: -10}
    const user = await controller.signin(
      {email: "asdf@asdf.com", password: "1234"} ,
      session
      );

      expect(user.id).toEqual(1);
      expect(session.userId).toEqual(1);
  })
  
});
