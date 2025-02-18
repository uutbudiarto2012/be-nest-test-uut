import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { decode } from 'jsonwebtoken';
import { DatabaseService } from 'src/database/database.service';
@Injectable()
export class SellerGuard implements CanActivate {
  constructor(private readonly db: DatabaseService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token.startsWith('Bearer')) {
      return false;
    }
    const jwtPayload = decode(request.headers.authorization.split(' ')[1]);
    const userId = jwtPayload.sub;
    const user = await this.db.user.findUnique({
      where: { id: userId.toString() },
    });
    return user.role === 'seller';
  }
}
