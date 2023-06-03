import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Users } from 'src/db/entities/Auth.entity';
import { Notes } from 'src/db/entities/Note.entity';
import {
  GetUserNotesInput,
  GetUserNotesOutput,
  NoteInput,
} from 'src/dto/GraphQL.dto';
import { cast } from 'src/utils';

@Injectable()
export class UserNotesService {
  constructor(private readonly db: EntityManager) {}

  async getUserNotes(input: GetUserNotesInput): Promise<GetUserNotesOutput> {
    const user = await this.db.findOneOrFail(Users, { uuid: input.userUUID });
    const notes = await this.db.find(Notes, { user: { uuid: input.userUUID } });
    return cast(GetUserNotesOutput, {
      user: {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      },
      notes: notes.map((nth) => {
        return {
          id: nth.id,
          message: nth.message,
        };
      }),
      info: {},
    });
  }

  async createUserNote(input: NoteInput) {
    const note = new Notes();
    note.message = input.message;
    note.user = await this.db.findOneOrFail(Users, { uuid: input.userUUID });
    await this.db.persistAndFlush(note);
  }
}
