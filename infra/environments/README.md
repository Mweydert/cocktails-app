# Environments

Distant environments infra folder

## Configure environment

Create env file with environment name
```sh
cp .env.sample .env
# Fill created file
```

Execute setup script
```sh
./00-setup.sh
```

## Apply environment

Provide needed variables withing an env file for environment.
```sh
cp env.tfvars.sample ./terraform.tfstate.d/$ENV/env.tfvars
# Fill created file
```

Execute plan_apply script
```sh
./01-plan_apply.sh
```