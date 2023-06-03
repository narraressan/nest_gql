import { Migration } from '@mikro-orm/migrations';

export class Migration20230602063152 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "notes" drop constraint "notes_user_uuid_user_email_foreign";',
    );

    this.addSql(
      'alter table "users" alter column "email" type varchar(255) using ("email"::varchar(255));',
    );
    this.addSql(
      'alter table "users" alter column "auth0" type varchar(255) using ("auth0"::varchar(255));',
    );
    this.addSql('alter table "users" alter column "auth0" set not null;');
    this.addSql(
      'alter table "users" drop constraint "users_email_removed_unique";',
    );
    this.addSql('alter table "users" drop constraint "users_pkey";');
    this.addSql('alter table "users" drop constraint users_email_check;');
    this.addSql('alter table "users" alter column "email" drop not null;');
    this.addSql(
      'alter table "users" add constraint "users_auth0_removed_unique" unique ("auth0", "removed");',
    );
    this.addSql(
      'alter table "users" add constraint "users_pkey" primary key ("uuid", "auth0");',
    );

    this.addSql(
      'alter table "notes" drop constraint "notes_user_uuid_user_email_unique";',
    );
    this.addSql(
      'alter table "notes" rename column "user_email" to "user_auth0";',
    );
    this.addSql(
      'alter table "notes" add constraint "notes_user_uuid_user_auth0_foreign" foreign key ("user_uuid", "user_auth0") references "users" ("uuid", "auth0") on delete cascade;',
    );
    this.addSql(
      'alter table "notes" add constraint "notes_user_uuid_user_auth0_unique" unique ("user_uuid", "user_auth0");',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "notes" drop constraint "notes_user_uuid_user_auth0_foreign";',
    );

    this.addSql(
      'alter table "users" alter column "auth0" type varchar(255) using ("auth0"::varchar(255));',
    );
    this.addSql('alter table "users" alter column "auth0" drop not null;');
    this.addSql(
      'alter table "users" alter column "email" type varchar(255) using ("email"::varchar(255));',
    );
    this.addSql('alter table "users" alter column "email" set not null;');
    this.addSql(
      'alter table "users" drop constraint "users_auth0_removed_unique";',
    );
    this.addSql('alter table "users" drop constraint "users_pkey";');
    this.addSql(
      'alter table "users" add constraint "users_email_removed_unique" unique ("email", "removed");',
    );
    this.addSql(
      'alter table "users" add constraint "users_pkey" primary key ("uuid", "email");',
    );
    this.addSql(
      'alter table "users" add constraint users_email_check check(email = LOWER(email) AND LENGTH(TRIM(email)) > 0);',
    );

    this.addSql(
      'alter table "notes" drop constraint "notes_user_uuid_user_auth0_unique";',
    );
    this.addSql(
      'alter table "notes" rename column "user_auth0" to "user_email";',
    );
    this.addSql(
      'alter table "notes" add constraint "notes_user_uuid_user_email_foreign" foreign key ("user_uuid", "user_email") references "users" ("uuid", "email") on delete cascade;',
    );
    this.addSql(
      'alter table "notes" add constraint "notes_user_uuid_user_email_unique" unique ("user_uuid", "user_email");',
    );
  }
}
