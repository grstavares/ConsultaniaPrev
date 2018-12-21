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

    public static parseAWSError(error: AWSError, resource: { type: string; name: string; } ): ServiceError {

        var errorCode  = 'undefined';
        var httpCode = 500
        var resourceDescription = resource ? JSON.stringify(resource) : 'undefined';

        switch (error.code.toLowerCase()) {
            case 'networkingerror':
                errorCode = 'NetworkError'
                httpCode = 500;
                break;
            case 'missingrequiredparameter':
                errorCode = 'InvalidObjectBody'
                httpCode = 400;
                break;
            default:
                console.log('AWSError not identified!')
                console.log(error);
                break;
        }

        return {code: errorCode, httpStatusCode: httpCode, resource: resourceDescription, payload: error}

    }

    public static getRegionFromArn(arn: string): string {
        const splitted = arn.split(":");
        return splitted[3];
    }

}