/* tslint:disable no-implicit-dependencies */
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';

export function handler(event: APIGatewayProxyEvent, context: Context, callback: Callback): void {

    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Context:', JSON.stringify(context));
    callback(null, { statusCode: 200, body: JSON.stringify(event), headers: { 'Content-Type': 'application/json' } });

}
