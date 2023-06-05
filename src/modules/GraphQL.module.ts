import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import GraphQLConfig from 'src/config/GraphQL.config';
import { HealthController } from 'src/controllers/Health.controller';
import { UserNotesMutation } from 'src/resolvers/mutations/UserNotes.mutation';
import { UserNotesQuery } from 'src/resolvers/queries/UserNotes.query';
import { HealthService } from 'src/services/Health.service';
import { UserNotesService } from 'src/services/UserNotes.service';

@Module({
  imports: [GraphQLConfig, TerminusModule],
  controllers: [HealthController],
  providers: [
    // services ---
    HealthService,
    UserNotesService,

    // queries ---
    UserNotesQuery,

    // mutations ---
    UserNotesMutation,
  ],
})
export class GraphQLModule {}
