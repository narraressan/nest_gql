import { Entity, Enum, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { nullable } from 'src/utils';
import { Email } from 'src/utils/types';
import { UserRoleEnum, UUIDAndTimestamp } from './Base';

@Entity()
@Unique({ properties: ['auth0', 'removed'] })
export class Users extends UUIDAndTimestamp {
  @PrimaryKey()
  auth0?: string;

  @Property({ nullable })
  email: Email;

  @Property({ type: 'text', nullable })
  fullname?: string;

  @Enum({ items: () => UserRoleEnum, default: UserRoleEnum.USER })
  role: UserRoleEnum;
}
