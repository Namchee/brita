import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

export interface LambdaHandler {
  handler(
    event: APIGatewayEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult | void>;
}

export interface Response {
  data: object;
  error: object;
}
