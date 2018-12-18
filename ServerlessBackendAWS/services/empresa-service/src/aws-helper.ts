import { DynamoDB } from 'aws-sdk';

export class AwsHelper {

    public static marshalObject(object: Object): DynamoDB.AttributeMap {
        
        const marshsalled = DynamoDB.Converter.marshall(object, { convertEmptyValues: true, wrapNumbers: true })
        return marshsalled;

    }

    public static unmarshalObject(object: DynamoDB.AttributeMap): Object {

        const unmarshsalled = DynamoDB.Converter.unmarshall(object, { convertEmptyValues: true, wrapNumbers: true })
        return unmarshsalled;

    }

}