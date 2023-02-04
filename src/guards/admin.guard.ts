import { CurrentUser } from '../users/decorators/current-user.decorator';
import{
    CanActivate,
    ExecutionContext
} from '@nestjs/common';

export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();

        if(!request.CurrentUser){
            return false;
        }
        return request.CurrentUser.admin;
    }

}