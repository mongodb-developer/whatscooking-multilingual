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

echo "Operation completed successfully."
