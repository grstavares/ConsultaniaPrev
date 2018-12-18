import { APIGatewayProxyEvent } from 'aws-lambda';
import { HttpStatusCode } from './utilities';
import { ServiceError } from './types';
// import { Validator } from 'jsonschema';

export enum ValueType {
    array,
    object,
    string,
    number,
    date
}

export interface ObjectSchema {
    required: {[key: string]: ValueType};
    optional: {[key: string]: ValueType};
}

export class Validators {

    static isValidEmail(value: string): boolean { return true }
    static isValidUUID(value: string): boolean { return true }
    static isValidAPIGatewayEvent(value: Object): boolean { return true }
    static isValidSNSEvent(value: Object): boolean { return true }
    static isValidSQSEvent(value: Object): boolean { return true }
    static isValidS3Event(value: Object): boolean { return true }
    static isValidDynamoEvent(value: Object): boolean { return true }
    static isValidKinesisEvent(value: Object): boolean { return true }
    static isValidTopicArn(arn: string): boolean { return true }
    
    static isValidObject(schema: ObjectSchema, object: Object): Promise<boolean> {

        return new Promise((resolve: Function, reject: Function) => {
            
            const required = schema.required;
            for (var name in required) {
                if (!object.hasOwnProperty(name)) { 
                    const error: ServiceError = { code: 'InvalidObjectBody', httpStatusCode: HttpStatusCode.badRequest }
                    reject(error) 
                }
            }

            resolve(true);

        })

    }

}