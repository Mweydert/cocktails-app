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

## Configure S3 bucket 
Open [minio web console](http://localhost:9090) and create an access key.

TODO: where to put access key

## Launch apps

```sh
npm install
```

```sh
npm run dev
```