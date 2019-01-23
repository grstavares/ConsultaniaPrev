/* tslint:disable no-implicit-dependencies */
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';

export function handler(event: APIGatewayProxyEvent, context: Context, callback: Callback): void {

    callback(null, event);

}
