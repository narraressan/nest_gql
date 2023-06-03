import { Migration } from '@mikro-orm/migrations';

export class Migration20230603052049 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "notes" drop constraint "notes_user_uuid_user_auth0_foreign";',
    );

    this.addSql(
      'alter table "notes" drop constraint "notes_user_uuid_user_auth0_unique";',
    );
    this.addSql(
      'alter table "notes" add constraint "notes_user_uuid_user_auth0_foreign" foreign key ("user_uuid", "user_auth0") references "users" ("uuid", "auth0") on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "notes" drop constraint "notes_user_uuid_user_auth0_foreign";',
    );

    this.addSql(
      'alter table "notes" add constraint "notes_user_uuid_user_auth0_foreign" foreign key ("user_uuid", "user_auth0") references "users" ("uuid", "auth0") on delete cascade;',
    );
    this.addSql(
      'alter table "notes" add constraint "notes_user_uuid_user_auth0_unique" unique ("user_uuid", "user_auth0");',
    );
  }
}
