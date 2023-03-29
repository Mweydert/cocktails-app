# Set up local environment

## Launch dependencies

```sh
docker-compose up -d
```

Run migrations for DB:
```sh
cd packages/infrastructure
npm run migrations:run -- -d ormconfig.ts
```

## Launch apps

```sh
npm install
```

```sh
npm run dev
```