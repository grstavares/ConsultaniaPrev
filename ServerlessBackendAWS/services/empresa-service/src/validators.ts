import { APIGatewayProxyEvent } from 'aws-lambda';

export class Validators {

    static isValidEmail(value: string): Promise<boolean> {return new Promise<boolean>( (resolve, reject) => { resolve(true); } ) }
    static isValidUUID(value: string): Promise<boolean> {return new Promise<boolean>( (resolve, reject) => { resolve(true); } ) }
    static isValidAPIGatewayEvent(value: APIGatewayProxyEvent): Promise<boolean> {return new Promise<boolean>( (resolve, reject) => { resolve(true); } ) }
    static isValidSNSEvent(value: Object): Promise<boolean> {return new Promise<boolean>( (resolve, reject) => { resolve(true); } ) }
    static isValidSQSEvent(value: Object): Promise<boolean> {return new Promise<boolean>( (resolve, reject) => { resolve(true); } ) }
    static isValidS3Event(value: Object): Promise<boolean> {return new Promise<boolean>( (resolve, reject) => { resolve(true); } ) }
    static isValidDynamoEvent(value: Object): Promise<boolean> {return new Promise<boolean>( (resolve, reject) => { resolve(true); } ) }
    static isValidKinesisEvent(value: Object): Promise<boolean> {return new Promise<boolean>( (resolve, reject) => { resolve(true); } ) }
    static isValidTopicArn(arn: string): Promise<boolean> {return new Promise<boolean>( (resolve, reject) => { resolve(true); } ) }

}