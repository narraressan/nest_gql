import { Cascade, Entity, OneToOne, Property } from '@mikro-orm/core';
import { nullable } from 'src/utils';
import { Email } from 'src/utils/types';
import { IDAndTimestamp } from './Base';
import { Users } from './Auth.entity';

@Entity()
export class Notes extends IDAndTimestamp {
  @OneToOne({ entity: () => Users, cascade: [Cascade.REMOVE] })
  user: Users | Email;

  @Property({ type: 'text', nullable })
  message?: string;
}
