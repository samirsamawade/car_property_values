import { NestMiddleware, Injectable } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../users.service";
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from "../user.entity";

declare global {
    namespace Express{
        interface Request{
            CurrentUser?: User;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware{
    constructor (private usersService: UsersService){}

    async use(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.session || {};
        if(userId){
            const user = await this.usersService.findOne(userId);

            req.CurrentUser = user;
        }

        next();
    }
    
}