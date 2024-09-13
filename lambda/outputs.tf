output "lambda_function_urls" {
  value = {
    for func, func_data in aws_lambda_function_url.lambda_function_urls : func => {
      url = func_data.function_url
    }
  }
}