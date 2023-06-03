import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { nullable } from 'src/utils';
import { Email } from 'src/utils/types';
import { IDAndTimestamp } from './Base';
import { Users } from './Auth.entity';

@Entity()
export class Notes extends IDAndTimestamp {
  @ManyToOne(() => Users, { nullable })
  user: Users | Email;

  @Property({ type: 'text', nullable })
  message?: string;
}
