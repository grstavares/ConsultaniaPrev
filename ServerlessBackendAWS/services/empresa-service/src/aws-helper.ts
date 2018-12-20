import { DynamoDB, AWSError } from 'aws-sdk';
import { ServiceError } from './types';

export class AwsHelper {

    public static marshalObject(object: Object): DynamoDB.AttributeMap {
        
        const marshsalled = DynamoDB.Converter.marshall(object, { convertEmptyValues: true, wrapNumbers: true })
        return marshsalled;

    }

    public static unmarshalObject(object: DynamoDB.AttributeMap): Object {

        const unmarshsalled = DynamoDB.Converter.unmarshall(object, { convertEmptyValues: true, wrapNumbers: true })
        return unmarshsalled;

    }

    public static parseAWSError(error: AWSError): ServiceError {
        console.log(error.code)
        console.log(error.statusCode)
        console.log(error.message)

        const errorCode = error.code.toLowerCase() === 'missingrequiredparameter' ? 'InvalidObjectBody' : 'undefined'
        const httpCode = error.code.toLowerCase() === 'missingrequiredparameter' ? 400 : 500

        return {code: errorCode, httpStatusCode: httpCode, resource: error.name, payload: null}

    }

    public static getRegionFromArn(arn: string): string {
        const splitted = arn.split(":");
        return splitted[3];
    }

}