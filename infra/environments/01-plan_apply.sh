#!/bin/bash 

# Load env variables
if [ -f .env ]; then
    ENV_VARS="$(cat .env | awk '!/^\s*#/' | awk '!/^\s*$/')"
    eval "$(
    printf '%s\n' "$ENV_VARS" | while IFS='' read -r line; do
        key=$(printf '%s\n' "$line"| sed 's/"/\\"/g' | cut -d '=' -f 1)
        value=$(printf '%s\n' "$line" | cut -d '=' -f 2- | sed 's/"/\\\"/g')
        printf '%s\n' "export $key=\"$value\""
    done
    )"
fi

# Plan & Apply
terraform plan \
    -var-file=./terraform.tfstate.d/$ENV/env.tfvars \
    -out=./terraform.tfstate.d/$ENV/data.tfplan
    
terraform apply ./terraform.tfstate.d/$ENV/data.tfplan
