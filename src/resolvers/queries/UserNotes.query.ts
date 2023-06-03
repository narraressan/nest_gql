import { Args, Query } from '@nestjs/graphql';
import { UserRoleEnum } from 'src/db/entities/Base';
import { GetUserNotesInput, GetUserNotesOutput } from 'src/dto/GraphQL.dto';
import { UserNotesService } from 'src/services/UserNotes.service';
import { PrivateResolver } from 'src/decorators';

@PrivateResolver(UserRoleEnum.ADMIN, UserRoleEnum.MANAGEMENT, UserRoleEnum.USER)
export class UserNotesQuery {
  constructor(private readonly notes: UserNotesService) {}

  @Query(() => GetUserNotesOutput)
  async getUserNotes(
    @Args('input') input: GetUserNotesInput,
  ): Promise<GetUserNotesOutput> {
    return await this.notes.getUserNotes(input);
  }
}
