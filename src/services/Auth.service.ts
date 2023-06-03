import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Users } from 'src/db/entities/Auth.entity';
import { LoginOutputDto } from 'src/dto/Auth.dto';
import { UserRoleEnum } from 'src/db/entities/Base';
import { cast } from 'src/utils';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import jwtdecode from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: EntityManager,
    private readonly httpService: HttpService,
  ) {}

  async authorize(code: string): Promise<LoginOutputDto> {
    const { data } = await lastValueFrom(
      new HttpService().post(
        `${process.env.AUTH0_DOMAIN}oauth/token`,
        `grant_type=authorization_code&client_id=${process.env.AUTH0_CLIENT_ID}&client_secret=${process.env.AUTH0_SECRET}&code=${code}&redirect_uri=${process.env.AUTH0_REDIRECT}`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      ),
    );
    const info: Record<string, any> = jwtdecode(data?.access_token);
    const user =
      (await this.db.findOne(Users, {
        auth0: info.sub,
        removed: 0,
      })) || new Users();

    const { data: userInfo } = await lastValueFrom(
      new HttpService().get(`${process.env.AUTH0_DOMAIN}userinfo`, {
        headers: {
          Authorization: `Bearer ${data?.access_token}`,
        },
      }),
    );

    user.auth0 = userInfo.sub;
    user.email = userInfo?.email;
    user.fullname = userInfo?.name;
    user.role = !user.role ? UserRoleEnum.USER : user.role;
    await this.db.persistAndFlush(user);

    return cast(LoginOutputDto, {
      accessToken: data?.access_token,
      refreshToken: data?.refresh_token,
    });
  }

  async verify(token: Record<string, any>): Promise<Users> {
    try {
      return await this.db.findOneOrFail(Users, {
        auth0: token.sub,
        removedAt: null,
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }
}
