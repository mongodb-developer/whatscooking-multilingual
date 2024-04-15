#!/bin/bash

# Check if the NodeJS version is 16
node_version=$(node -v)
expected_version="v16"

if [[ $node_version != $expected_version* ]]; then
  echo "This script requires NodeJS version 16. Current version is $node_version."
  exit 1
fi

# Delete the "build" folder and run `npm run build`
echo "Rebuilding the project..."
rm -rf build
npm run build

# Check for AWS credentials
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_SESSION_TOKEN" ]; then
  echo "AWS credentials are not set. Please export AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_SESSION_TOKEN."
  exit 1
fi

# Define the bucket and region
bucket_name="whatscooking-aseansa"
region="ap-southeast-1"

# Empty the S3 bucket
echo "Emptying the bucket..."
aws s3 rm "s3://$bucket_name" --recursive --region $region

# Upload the contents of the "build" folder to the S3 bucket
echo "Uploading contents to $bucket_name..."
aws s3 cp build/ "s3://$bucket_name" --recursive --region $region

# Ask user if they want to invalidate the CloudFront cache
echo "Do you want to invalidate the CloudFront cache? (y/n)"
read invalidate_cache

case "$invalidate_cache" in
  [yY] | [yY][eE][sS])
    echo "Please enter the CloudFront distribution ID:"
    read distribution_id
    if [[ -n $distribution_id ]]; then
      echo "Invalidating CloudFront cache..."
      aws cloudfront create-invalidation --distribution-id $distribution_id --paths "/*"
    else
      echo "Distribution ID was not provided."
      exit 1
    fi
    ;;
  *)
    echo "Skipping CloudFront cache invalidation."
    ;;
esac

echo "Operation completed successfully."