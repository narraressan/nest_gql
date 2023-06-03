import { UseGuards, applyDecorators } from '@nestjs/common';
import { Field, Resolver } from '@nestjs/graphql';
import { ClassConstructor, Type } from 'class-transformer';
import { IsArray, IsDefined, IsObject, ValidateNested } from 'class-validator';
import { UserRoleEnum } from 'src/db/entities/Base';
import { IsPrivateGQLApi } from 'src/guards/Auth.guard';
import { UserRoles, UserRolesGQLGuard } from 'src/guards/Roles.guard';
import { GQLThrottlerGuard } from 'src/guards/Throttle.guard';

export const PrivateResolver = (...roles: UserRoleEnum[]) => {
  return applyDecorators(
    Resolver(),
    UserRoles(...roles),
    UseGuards(GQLThrottlerGuard, IsPrivateGQLApi, UserRolesGQLGuard),
  );
};

export const GqlNestedField = <T>(dto: ClassConstructor<T>) => {
  return applyDecorators(
    IsObject(),
    IsDefined(),
    ValidateNested(),
    Type(() => dto),
    Field(() => dto),
  );
};

export const GqlNestedArrayField = <T>(dto: ClassConstructor<T>) => {
  return applyDecorators(
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => dto),
    Field(() => [dto]),
  );
};
