import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from "./users.service";

describe('AuthService', ()=>{
    let service : AuthService;

    let fakeUsersService: Partial<UsersService>;

beforeEach( async ()=>{
    const users: User[] = [];

    fakeUsersService = {
        find: (email: string) => {
            const filteredUsers = users.filter(user => user.email === email);
            return Promise.resolve(filteredUsers);
        },
        create: (email: string, password: string)=>{
            const user = { id: Math.floor(Math.random() * 99999), email, password};
            users.push(user);
            return Promise.resolve(user);
        }
    }
    const module = await Test.createTestingModule({
        providers:[
            AuthService,
            {
                provide: UsersService,
                useValue: fakeUsersService
            }
        ]
    }).compile();
    
    service = module.get(AuthService);
})
it('can create a n instance of auth service',async () => {
    
    expect(service).toBeDefined();
});

it('create a new user with a salted and hashed password', async ()=>{
    const user = await service.signup('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
});

it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
      ]);
    await expect(
      service.signin('laskdjf@alskdfj.com', 'passowrd'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('asdf@asdf.com', 'password1')

    const user = await service.signin('asdf@asdf.com', 'password1');

    expect(user).toBeDefined();

  });

});
