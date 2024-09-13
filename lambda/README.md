# Whatscooking BaaS using AWS Lambda Functions

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js v20](https://nodejs.org/) (with npm)
- [AWS CLI](https://aws.amazon.com/cli/)
- [Terraform](https://www.terraform.io/downloads.html)

## Generating Lambda Layer

To generate the Lambda layer, run:

```bash
npm run layer:build
```

## Deployment

1. Replace `mongodb_uri` in [terraform.tfvars](./terraform.tfvars)

2. Deploy the resources using Terraform:

    ```bash
    terraform init
    terraform apply
    ```

3. After the deployment is complete, note the 4 Lambda Function URLs provided by Terraform.

## Testing

```bash
# getFoodSynonyms
curl https://nqez7rq6c6hkbsydjsf3ktpfru0qkaan.lambda-url.ap-southeast-1.on.aws?locale=en

# getRestaurants
curl \
-H "Content-Type: application/json" \
-d '{"searchTerm": "burger ", "food": "", "operator": "text",    "dist": 1, "stars": 1, "cuisine": [], "locale": "en"}' \
https://f6lhyweuc6xvqp5jylghwt7v5u0qzwjz.lambda-url.ap-southeast-1.on.aws 

# getFacets
curl \
-H "Content-Type: application/json" \
-d '{"searchTerm": "burger", "food": "", "operator": "text", "dist": 1, "stars": 1, "cuisine": [], "locale": "en"}' \
https://cwoaaqy74pwe76cajhevu7kaby0eutbe.lambda-url.ap-southeast-1.on.aws

# getRestaurantsAutocomplete
curl https://7voovjzrkjgdudds53so7rtsae0vjouf.lambda-url.ap-southeast-1.on.aws?restname=burger&locale=en
```

## Cleanup

```bash
terraform destroy
```
