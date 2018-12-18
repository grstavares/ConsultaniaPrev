import { APIGatewayProxyEvent } from 'aws-lambda';
import { Validator } from 'jsonschema';

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
    
    static isValidObject(schema: Object, object: Object): boolean {

        const validator = new Validator();
        return validator.validate(object, schema).valid

    }

}