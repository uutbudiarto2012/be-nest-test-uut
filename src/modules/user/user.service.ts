import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, LoginDto, LogoutDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { comparePassword, hashPassword } from 'src/utils/password';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { createPaginator } from 'prisma-pagination';
import { Prisma, Role, User, UserSession } from '@prisma/client';
import { jwtRefreshSecret, jwtSecret } from 'src/utils/constants';
import * as dayjs from 'dayjs';
@Injectable()
export class UserService {
  constructor(
    private readonly db: DatabaseService,
    private jwt: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    createUserDto.password = await hashPassword(createUserDto.password);
    return this.db.user.create({
      data: createUserDto,
      select: {
        id: true,
        email: true,
      },
    });
  }
  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await hashPassword(createUserDto.password);
    createUserDto.role = 'admin';
    return this.db.user.create({
      data: createUserDto,
      select: {
        id: true,
        email: true,
      },
    });
  }
  async login(loginDto: LoginDto) {
    const user = await this.findByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException('Invalid crdentials!');
    }
    const validPassword = await comparePassword(
      loginDto.password,
      user.password,
    );
    if (!validPassword) {
      throw new NotFoundException('Invalid crdentials!');
    }

    // CREATE TOKEN
    const payload = { sub: user.id };
    const access_token = await this.signToken(payload);
    const refresh_token = await this.signRefreshToken(payload);

    const session = {
      user_id: user.id,
      refresh_token: refresh_token,
      expires_at: dayjs().add(1, 'day').toISOString(),
    };
    const sessionResponse = await this.db.userSession.create({
      data: session,
      select: {
        id: true,
        user_id: true,
      },
    });
    return {
      session: sessionResponse,
      access_token,
      refresh_token,
    };
  }

  async logout(logoutDto: LogoutDto) {
    return this.db.userSession.delete({
      where: { refresh_token: logoutDto.refresh_token },
    });
  }
  async logoutAll(logoutDto: LogoutDto) {
    const tokenDecoded = await this.decodeToken(logoutDto.refresh_token);
    return this.db.userSession.deleteMany({
      where: { user_id: tokenDecoded.sub },
    });
  }

  findAll(query: { page: string; perPage: string; role: Role }) {
    const { page, perPage, role } = query;
    const paginate = createPaginator({ page, perPage });
    const whereFilter: Prisma.UserFindManyArgs['where'] = role
      ? { role: role }
      : {};
    return paginate<User, Prisma.UserFindManyArgs>(this.db.user, {
      where: whereFilter,
      select: {
        id: true,
        email: true,
        full_name: true,
        gender: true,
        birthday: true,
        role: true,
        is_enabled: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
  getSession(query: { user_id: string; page: string; perPage: string }) {
    const { page, perPage, user_id } = query;
    const paginate = createPaginator({ page, perPage });
    const whereFilter: Prisma.UserSessionFindManyArgs['where'] = user_id
      ? { user_id: user_id }
      : {};
    return paginate<UserSession, Prisma.UserSessionFindManyArgs>(
      this.db.userSession,
      {
        where: whereFilter,
      },
    );
  }

  async findOne(id: string) {
    const response = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        full_name: true,
        gender: true,
        birthday: true,
        role: true,
        is_enabled: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (!response) {
      throw new NotFoundException(`ID: ${id} not found`);
    }
    return response;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    return this.db.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        full_name: true,
        gender: true,
        birthday: true,
        role: true,
        is_enabled: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findByEmail(email: string) {
    const user = await this.db.user.findUnique({
      where: { email },
    });
    return user;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.user.delete({
      where: { id },
      select: {
        id: true,
      },
    });
  }

  async signToken(args: { sub: string }) {
    const payload = args;
    return this.jwt.signAsync(payload, { secret: jwtSecret, expiresIn: '1d' });
  }
  async decodeToken(token: string) {
    return this.jwt.decode(token);
  }
  async signRefreshToken(args: { sub: string }) {
    const payload = args;
    return this.jwt.signAsync(payload, {
      secret: jwtRefreshSecret,
      expiresIn: '7d',
    });
  }
}
