import { Context, Callback, APIGatewayProxyEvent } from 'aws-lambda';
import { BusinessEvent } from './types.d';
import { Sidecar } from './sidecar';
import  * as uuid from './utils';

const lakeName = 'thisBucket';
const tableName = 'thisTable';
const topicArn = 'thisTopic';
const isLambda = !!(process.env.LAMBDA_TASK_ROOT || false);

function parseObject(apiEvent: APIGatewayProxyEvent): Promise<string> {

    return new Promise((resolve: Function, reject: Function) => {

        const object = { key: 'value' };
        resolve(JSON.stringify(object));

    });

}

export function handler (event: APIGatewayProxyEvent, context: Context, callback: Callback): void {

    const objectKey = uuid();
    const successEvent: BusinessEvent = {topicArn: topicArn, body: JSON.stringify(event) };

    const sidecar = new Sidecar();
    
    sidecar.parseAPIGatewayEvent(event)
    .then(validated => sidecar.validateRights(event))
    .then(authorized => sidecar.persistOnLake(lakeName, objectKey, event))
    .then(persistedOnLake => parseObject(event))
    .then(parsed => sidecar.persistInTable(tableName, objectKey, parsed))
    .then(persistedOnTable => sidecar.publishEvent(successEvent, event))
    .then(published => sidecar.createResponse(event))
    .then(response => callback(null, response))
    .catch(err => callback(err, null))
    .catch(callBackError => console.log);

}