import { Migration } from '@mikro-orm/migrations';

export class Migration20230602063021 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "users" add column "auth0" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" drop column "auth0";');
  }
}
