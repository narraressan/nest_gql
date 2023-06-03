import { PrimaryKey, Property } from '@mikro-orm/core';
import { getServerTime, nullable } from '../../utils';

export abstract class RemovedTimestamp {
  // ref: https://stackoverflow.com/a/9575869 - UTC in milliseconds
  @Property({ type: 'bigint', default: 0 })
  removed?: number;

  @Property({ type: 'timestamptz', nullable })
  removedAt?: string;
}

export abstract class Timestamp extends RemovedTimestamp {
  @Property({ type: 'timestamptz', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: string = getServerTime().toString();

  @Property({
    type: 'timestamptz',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => getServerTime().toString(),
  })
  updatedAt: string = getServerTime().toString();
}

export abstract class IDAndTimestamp extends Timestamp {
  @PrimaryKey()
  id: number;
}

export abstract class UUIDAndTimestamp extends Timestamp {
  @Property({ autoincrement: true })
  id: number;

  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  uuid: string;
}

export abstract class KeyID {
  @PrimaryKey()
  id: number;
}

export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  MANAGEMENT = 'MANAGEMENT',
  USER = 'USER',
}

export class UserRole {
  static fromStr = (unit: string): UserRoleEnum | null => {
    if (unit === 'ADMIN') return UserRoleEnum.ADMIN;
    else if (unit === 'MANAGEMENT') return UserRoleEnum.MANAGEMENT;
    else if (unit === 'USER') return UserRoleEnum.USER;
    return null;
  };
}
