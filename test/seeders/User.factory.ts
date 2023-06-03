import { Factory, Faker } from '@mikro-orm/seeder';
import { Users } from 'src/db/entities/Auth.entity';
import { UserRoleEnum } from 'src/db/entities/Base';

export class UserFactory extends Factory<Users> {
  model = Users;

  definition(faker: Faker): Partial<Users> {
    return {
      email: faker.internet.email().toLowerCase(),
      role: UserRoleEnum.USER,
      fullname: faker.name.fullName(),
      auth0: faker.random.alpha(10),
    };
  }
}
