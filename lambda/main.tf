data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
  managed_policy_arns = ["arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"]
}

resource "aws_lambda_layer_version" "mongodb_layer" {
  filename   = "nodejs.zip" 
  layer_name = "mongodb_layer"
  compatible_runtimes = ["nodejs20.x"]
}


locals {
  lambda_functions = {
    get_food_synonyms = {
      source_file   = "./getFoodSynonyms.js"
      output_path   = "./getFoodSynonyms.zip"
      handler       = "getFoodSynonyms.handler"
      environment   = { MONGODB_URI = var.mongodb_uri }
    },
    get_facets = {
      source_file   = "./getFacets.js"
      output_path   = "./getFacets.zip"
      handler       = "getFacets.handler"
      environment   = { MONGODB_URI = var.mongodb_uri }
    },
    get_restaurants = {
      source_file   = "./getRestaurants.js"
      output_path   = "./getRestaurants.zip"
      handler       = "getRestaurants.handler"
      environment   = { MONGODB_URI = var.mongodb_uri }
    },
    get_restaurants_autocomplete = {
      source_file   = "./getRestaurantsAutocomplete.js"
      output_path   = "./getRestaurantsAutocomplete.zip"
      handler       = "getRestaurantsAutocomplete.handler"
      environment   = { MONGODB_URI = var.mongodb_uri }
    }
  }
}

# Create an archive for each Lambda function
resource "aws_lambda_function" "lambda_functions" {
  for_each       = local.lambda_functions
  filename       = each.value.output_path
  function_name  = each.key
  role           = aws_iam_role.iam_for_lambda.arn
  handler        = each.value.handler
  runtime        = "nodejs20.x"
  source_code_hash = data.archive_file.lambda_archives[each.key].output_base64sha256
  layers         = [aws_lambda_layer_version.mongodb_layer.arn]
  timeout        = 30

  environment {
    variables = each.value.environment
  }
}

# Create data archive for Lambda functions
data "archive_file" "lambda_archives" {
  for_each   = local.lambda_functions
  type       = "zip"
  source_file = each.value.source_file
  output_path = each.value.output_path
}

# Create a Lambda function URL for each function
resource "aws_lambda_function_url" "lambda_function_urls" {
  for_each          = aws_lambda_function.lambda_functions
  function_name     = each.value.function_name
  authorization_type = "NONE"

  cors {
    allow_origins     = ["http://localhost:3000", "https://whatscooking.mongosa.net"]
    allow_methods     = ["*"]
    allow_headers     = ["*"]
    max_age           = 3600
  }
}