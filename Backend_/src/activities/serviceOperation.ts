import { ResponseBuilder, UUID } from '../common/utilities';
import { APIGatewayResponse, ServiceError } from '../common/types';
import { InputParser, DependencyInjector } from '../common/backend';
import { BaseOperations } from '../common/baseOperation';

export enum AllowedOperation {

    GetAllActivity = 'GetAllActivity',
    GetActivity = 'GetActivity',
    CreateActivity = 'CreateActivity',
    UpdateActivity = 'UpdateActivity',
    RemoveActivity = 'RemoveActivity',

}

export class ServiceOperation extends BaseOperations {

    private readonly httpPathParamId = 'activityId';
    private readonly tableHashKey = 'itemId';

    constructor(private readonly eventParser: InputParser, traceId: string) { super(traceId); }

    public getOperation(): AllowedOperation {

        const resource = this.eventParser.getResource();
        const method = this.eventParser.getHttpMethod();

        if (resource.toLowerCase() === '/activities') {

            if (method.toLowerCase() === 'get') { return AllowedOperation.GetAllActivity;
            } else if (method.toLowerCase() === 'post') { return AllowedOperation.CreateActivity;
            } else {return null; }

        } else if (resource.toLowerCase() === '/activities/{activityid}') {

            if (method.toLowerCase() === 'get') { return AllowedOperation.GetActivity;
            } else if (method.toLowerCase() === 'put') { return AllowedOperation.UpdateActivity;
            } else if (method.toLowerCase() === 'delete') { return AllowedOperation.RemoveActivity;
            } else {return null; }

        } else { return null; }

    }

    public async perform(injector: DependencyInjector): Promise<APIGatewayResponse> {

        const institutionId = 'mockedIntitution';
        const operation = this.getOperation();

        switch (operation) {

            case 'GetAllActivity': {
                const objectKey = this.eventParser.getPathParam(this.httpPathParamId);
                return this.queryItemsOnIndexByKeys(injector, 'indexName', { institutionId: institutionId, itemId: objectKey });
            }

            case 'GetActivity': {
                const objectKey = this.eventParser.getPathParam(this.httpPathParamId);
                return this.getItem(injector, { institutionId: institutionId, itemId: objectKey });
            }

            case 'CreateActivity': {

                const objectKey = UUID.newUUID();
                const objectValues = this.eventParser.getPayload();
                const keyedObject = { institutionId: institutionId, itemId: objectKey, ...objectValues};
                const validObject = this.parseInputBody(keyedObject);

                if (validObject !== null && validObject != undefined) {

                    const createdPath = `${this.eventParser.getResource()}/${objectKey}}`;
                    return this.putItem(injector, { institutionId: institutionId, itemId: objectKey }, keyedObject)
                    .then((response: APIGatewayResponse) => {

                        if (response.statusCode === 200) { return ResponseBuilder.created(createdPath, keyedObject);
                        } else {return response; }

                    });

                } else { return ResponseBuilder.badRequest('Invalid Request Body', this.traceId); }

            }

            case 'UpdateActivity': {

                const objectKey = this.eventParser.getPathParam(this.httpPathParamId);
                const objectValues = this.eventParser.getPayload();

                const itemKeys = { institutionId: institutionId, itemId: objectKey };
                const validObject = this.parseInputBody({...itemKeys, ...objectValues});

                if (validObject !== null && validObject != undefined) {

                    /* tslint:disable no-dynamic-delete no-string-literal*/
                    delete objectValues['institutionId'];
                    delete objectValues[this.tableHashKey];
                    return this.updateItem(injector, itemKeys, objectValues);

                } else { return ResponseBuilder.badRequest('Invalid Request Body', this.traceId); }

            }

            case 'RemoveActivity': {
                const objectKey = this.eventParser.getPathParam(this.httpPathParamId);
                const deleteMarker = { wasDeleted: true };
                return this.updateItem(injector, { institutionId: institutionId, itemId: objectKey }, deleteMarker);
            }

            default: {

                const response = ResponseBuilder.badRequest('Invalid Request Method', this.traceId);
                return Promise.reject(response);

            }
        }
    }

    // tslint:disable-next-line: no-unsafe-any
    private parseInputBody(input: any): Object { return input; }

}
