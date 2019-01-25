import { ResponseBuilder, UUID } from '../common/utilities';
import { APIGatewayResponse, ServiceError } from '../common/types';
import { InputParser, DependencyInjector } from '../common/backend';
import { BaseOperations } from '../common/baseOperation';

export enum AllowedOperation {

    GetAllNewsReport = 'GetAllNewsReport',
    GetNewsReport = 'GetNewsReport',
    CreateNewsReport = 'CreateNewsReport',
    UpdateNewsReport = 'UpdateNewsReport',
    RemoveNewsReport = 'RemoveNewsReport',

}

export class ServiceOperation extends BaseOperations {

    private readonly httpPathParamId = 'newsreportId';
    private readonly tableHashKey = 'uuid';

    constructor(private readonly eventParser: InputParser, traceId: string) { super(traceId); }

    public getOperation(): AllowedOperation {

        const resource = this.eventParser.getResource();
        const method = this.eventParser.getHttpMethod();

        if (resource.toLowerCase() === '/newsreports') {

            if (method.toLowerCase() === 'get') { return AllowedOperation.GetAllNewsReport;
            } else if (method.toLowerCase() === 'post') { return AllowedOperation.CreateNewsReport;
            } else {return null; }

        } else if (resource.toLowerCase() === '/newsreports/{newsreportid}') {

            if (method.toLowerCase() === 'get') { return AllowedOperation.GetNewsReport;
            } else if (method.toLowerCase() === 'put') { return AllowedOperation.UpdateNewsReport;
            } else if (method.toLowerCase() === 'delete') { return AllowedOperation.RemoveNewsReport;
            } else {return null; }

        } else { return null; }

    }

    public async perform(injector: DependencyInjector): Promise<APIGatewayResponse> {

        const operation = this.getOperation();

        switch (operation) {

            case 'GetAllNewsReport': {
                const objectKey = this.eventParser.getPathParam(this.httpPathParamId);
                return this.getItem(injector, { uuid: objectKey });
            }

            case 'GetNewsReport': {
                const objectKey = this.eventParser.getPathParam(this.httpPathParamId);
                return this.getItem(injector, { uuid: objectKey });
            }

            case 'CreateNewsReport': {
                const objectKey = UUID.newUUID();
                const objectValues = this.eventParser.getPayload();
                const keyedObject = { uuid: objectKey, ...objectValues};

                return this.putItem(injector, { uuid: objectKey }, keyedObject)
                .then((response) => ResponseBuilder.created('teste', keyedObject));

            }

            case 'UpdateNewsReport': {

                const objectKey = this.eventParser.getPathParam(this.httpPathParamId);
                const objectValues = this.eventParser.getPayload();

                /* tslint:disable no-dynamic-delete */
                delete objectValues[this.tableHashKey];
                return this.updateItem(injector, { uuid: objectKey }, objectValues);

            }

            case 'RemoveNewsReport': {
                const objectKey = this.eventParser.getPathParam(this.httpPathParamId);
                const deleteMarker = { wasDeleted: true };
                return this.updateItem(injector, { uuid: objectKey }, deleteMarker);
            }

            default: {

                const response = ResponseBuilder.badRequest('Invalid Request Method', this.traceId);
                return Promise.reject(response);

            }
        }
    }

}
