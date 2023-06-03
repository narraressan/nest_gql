import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLError } from 'graphql';
import { HttpStatus } from '@nestjs/common';

interface GqlError {
  // status code or error alias
  error: string | number;

  // error description/s
  message?: string | any[];
}

export default GraphQLModule.forRoot({
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/resolvers/schema.gql'),
  sortSchema: true,
  resolvers: { JSON: GraphQLJSON },
  // ref: https://github.com/nestjs/graphql/issues/1053#issuecomment-786972617
  formatError: (error: GraphQLError): GqlError => {
    const extensions = error.extensions;
    const originalError: Record<any, any> = extensions?.originalError;
    const isList = typeof originalError?.message;
    console.log(`GQL error detected:`, error);
    return {
      error:
        originalError?.error ||
        originalError?.statusCode ||
        error?.message ||
        HttpStatus.INTERNAL_SERVER_ERROR,
      message:
        (isList === 'object'
          ? originalError?.message?.reduce((newVal: any, curVal: any) => {
              if (typeof curVal === 'string') {
                newVal.push(curVal);
                return newVal;
              } else return newVal.concat(Object.values(curVal));
            }, [])
          : originalError?.message) || 'Internal error',
    };
  },
  context: ({ req, res }) => ({ req, res }),
});
