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

Open [minio web console](http://localhost:9090):
- Create an access key
- Create a bucket 

Fill backend env variables with the values you just created.

## Launch apps

```sh
npm install
```

```sh
npm run dev
```