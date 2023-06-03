import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserRoleEnum } from 'src/db/entities/Base';
import { GqlSuccess, NoteInput } from 'src/dto/GraphQL.dto';
import { GQLThrottlerGuard } from 'src/guards/Throttle.guard';
import { IsPrivateGQLApi } from 'src/guards/Auth.guard';
import { UserRoles, UserRolesGQLGuard } from 'src/guards/Roles.guard';
import { UserNotesService } from 'src/services/UserNotes.service';

@Resolver()
@UserRoles(UserRoleEnum.ADMIN, UserRoleEnum.MANAGEMENT)
@UseGuards(IsPrivateGQLApi, GQLThrottlerGuard, UserRolesGQLGuard)
export class UserNotesMutation {
  constructor(private readonly notes: UserNotesService) {}

  @Mutation(() => GqlSuccess)
  async createUserNote(@Args('input') input: NoteInput): Promise<GqlSuccess> {
    await this.notes.createUserNote(input);
    return GqlSuccess.ok();
  }
}
