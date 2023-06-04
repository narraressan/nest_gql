# Simple REST with Nest

This project is a showcase of my expertise in back-end development using NestJS. It demonstrates a GraphQL architecture with features like CI/CD, Automated testing, Authentication and Authorization using **Auth0**, ORM, and containerization.

It highlights my ability to build scalable and secure applications, utilizing modern technologies and best practices.

### Dependencies

- [NestJs](https://docs.nestjs.com/) using `@nestjs/cli`
- [MikroORM](https://mikro-orm.io/) + [PostgreSQL](https://www.postgresql.org/)
- [CI/CD](https://github.com/features/actions)
- [Docker](https://www.docker.com/)
- [Auth0](https://auth0.com/docs/api)
- [GraphQL](https://graphql.org/)

Note:

- open [graphiql](http://localhost:3030/graphql) for testing Queries and Mutation
- to sign-up / sign-in, open link on browser -> `$AUTH0_DOMAIN/authorize?audience=$AUTH0_AUDIENCE&scope=offline_access%20openid%20email%20name&response_type=code&client_id=$AUTH_CLIENTID&redirect_uri=$AUTH_CALLBACK&state=STATE`

### Execution

```bash
yarn install
docker-compose up database -d
yarn start
yarn test
```

### Migrations with MikroORM

```bash
yarn generate_migration
yarn revert_db
yarn migrate_db
```

### CI/CD to Production

```bash
docker build --file ./dockerfile --tag [image_name]:[version] . --no-cache --progress=plain

# Publish image to registry
# login using specific user docker login docker.io -u username -p password
docker login docker.io
docker push [username]/[image_name]:[version]
docker logout
```

### TODO

- add `refresh token` mechanism
- integrate Auth0 logout API
