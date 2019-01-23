import { APIGatewayProxyEvent } from 'aws-lambda';

export class APIGatewayEventValidator {

    static validate(event: APIGatewayProxyEvent): Boolean { return true }

}