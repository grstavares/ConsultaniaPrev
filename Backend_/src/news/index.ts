/* tslint:disable no-implicit-dependencies */
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import { ServiceOperation } from './serviceOperation';
import { AWSParser } from '../aws/parser';
import { AWSDependencyInjector } from '../aws/injector';

export function handler(event: APIGatewayProxyEvent, context: Context, callback: Callback): void {

    const eventParser = AWSParser.parseAPIGatewayEvent(event);
    const operation = new ServiceOperation(eventParser, context.awsRequestId);
    const injector = new AWSDependencyInjector(context);

    operation.perform(injector)
    .then((response) => callback(null, response))
    .catch((response) => callback(null, response));

}
