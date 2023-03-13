# infrastructure

## Database migrations

### Generate new migration

Generate a new migration from difference between your schemas and current database, see [official documentation](https://typeorm.io/migrations#generating-migrations) for more informations.

```sh
npm run migrations:generate <MigrationName> -- -d ormconfig.ts
```

### Run migrations

Run migrations, see [oficial documentation](https://typeorm.io/migrations#running-and-reverting-migrations) for more informations.

```sh
npm run migrations:run -- -d ormconfig.ts
```

### Revert last executed migration

```sh
npm run migrations:revert -- -d ormconfig.ts
```
