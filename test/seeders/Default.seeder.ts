import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserFactory } from './User.factory';

export class DefaultSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    new UserFactory(em).create(20);

    // TODO: seed default tables here...
  }
}
