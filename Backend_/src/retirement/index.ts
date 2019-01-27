/* tslint:disable no-implicit-dependencies */
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import { ServiceOperation } from './serviceOperation';
import { AWSParser } from '../aws/parser';
import { AWSDependencyInjector } from '../aws/injector';
import { DependencyInjector } from '../common';

let injector: DependencyInjector = null;

export function setInjector(_injector: DependencyInjector): void { injector = _injector; }

export function handler(event: APIGatewayProxyEvent, context: Context, callback: Callback): void {

    const eventParser = AWSParser.parseAPIGatewayEvent(event);
    const operation = new ServiceOperation(eventParser, context.awsRequestId);
    const resolver = (injector === null) ? new AWSDependencyInjector(context) : injector;

    operation.perform(resolver)
    .then((response) => callback(null, response))
    .catch((response) => callback(null, response));

}
