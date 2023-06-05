import { Args, Mutation } from '@nestjs/graphql';
import { UserRoleEnum } from 'src/db/entities/Base';
import { GqlSuccess, NoteInput } from 'src/dto/GraphQL.dto';
import { UserNotesService } from 'src/services/UserNotes.service';
import { PrivateResolver } from 'src/decorators';

@PrivateResolver(UserRoleEnum.ADMIN, UserRoleEnum.MANAGEMENT, UserRoleEnum.USER)
export class UserNotesMutation {
  constructor(private readonly notes: UserNotesService) {}

  @Mutation(() => GqlSuccess)
  async createUserNote(@Args('input') input: NoteInput): Promise<GqlSuccess> {
    await this.notes.createUserNote(input);
    return GqlSuccess.ok();
  }
}
