import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
import { UserRoleEnum } from 'src/db/entities/Base';
import { GqlNestedArrayField, GqlNestedField } from 'src/decorators';
import { enumVals, nullable } from 'src/utils';

registerEnumType(UserRoleEnum, { name: 'UserRoleEnum' });

@ObjectType()
export class GqlSuccess {
  @IsString()
  @Field(() => String)
  message = 'Ok';

  @IsString()
  @Field(() => Int, { nullable })
  id?: number;

  static ok(id: number = null) {
    const success = new GqlSuccess();
    success.id = id;
    return success;
  }
}

@ObjectType('UserDetailOutput')
@InputType('UserDetailInput')
export class UserDetail {
  @IsInt()
  @IsOptional()
  @Field(() => Int, { nullable })
  id?: number;

  @IsUUID()
  @IsOptional()
  @Field(() => String, { nullable })
  uuid?: string;

  @IsEmail()
  @Field(() => String)
  email: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable })
  fullname?: string;

  @IsIn(enumVals(UserRoleEnum))
  @Field(() => UserRoleEnum)
  role: UserRoleEnum;
}

@ObjectType('NoteDetailOutput')
@InputType('NoteDetailInput')
class NoteDetail {
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable })
  message?: string;
}

@InputType()
export class NoteInput extends NoteDetail {
  @IsInt()
  @IsOptional()
  @Field(() => Int, { nullable })
  id?: number;

  @IsUUID()
  @Field(() => String)
  userUUID: string;
}

@ObjectType()
class NoteOutput extends NoteDetail {
  @IsInt()
  @Field(() => Int)
  id: number;
}

@InputType()
export class GetUserNotesInput {
  @IsUUID()
  @Field(() => String)
  userUUID: string;
}

@ObjectType()
export class GetUserNotesOutput {
  @GqlNestedField(UserDetail)
  user: UserDetail;

  @GqlNestedArrayField(NoteOutput)
  notes: NoteOutput[];

  @Field((type) => GraphQLJSON)
  info: JSON;
}
