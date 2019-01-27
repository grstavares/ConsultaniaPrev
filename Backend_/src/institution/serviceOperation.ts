import { ResponseBuilder, UUID } from '../common/utilities';
import { APIGatewayResponse, ServiceError } from '../common/types';
import { InputParser, DependencyInjector } from '../common/backend';
import { BaseOperations } from '../common/baseOperation';

export enum AllowedOperation {

    GetAllInstitution = 'GetAllInstitution',
    GetInstitution = 'GetInstitution',
    CreateInstitution = 'CreateInstitution',
    UpdateInstitution = 'UpdateInstitution',
    RemoveInstitution = 'RemoveInstitution',

}

export class ServiceOperation extends BaseOperations {

    private readonly httpPathParamId = 'institutionId';
    private readonly tableHashKey = 'itemId';

    constructor(private readonly eventParser: InputParser, traceId: string) { super(traceId); }

    public getOperation(): AllowedOperation {

        const resource = this.eventParser.getResource();
        const method = this.eventParser.getHttpMethod();

        if (resource.toLowerCase() === '/intitutions') {

            if (method.toLowerCase() === 'get') { return AllowedOperation.GetAllInstitution;
            } else if (method.toLowerCase() === 'post') { return AllowedOperation.CreateInstitution;
            } else {return null; }

        } else if (resource.toLowerCase() === '/intitutions/{institutionid}') {

            if (method.toLowerCase() === 'get') { return AllowedOperation.GetInstitution;
            } else if (method.toLowerCase() === 'put') { return AllowedOperation.UpdateInstitution;
            } else if (method.toLowerCase() === 'delete') { return AllowedOperation.RemoveInstitution;
            } else {return null; }

        } else { return null; }

    }

    public async perform(injector: DependencyInjector): Promise<APIGatewayResponse> {

        const institutionId = 'mockedIntitution';
        const operation = this.getOperation();

        switch (operation) {

            case 'GetAllInstitution': {
                const objectKey = this.eventParser.getPathParam(this.httpPathParamId);
                return this.queryItemsOnIndexByKeys(injector, 'indexName', { institutionId: institutionId, itemId: objectKey });
            }

            case 'GetInstitution': {
                const objectKey = this.eventParser.getPathParam(this.httpPathParamId);
                return this.getItem(injector, { institutionId: institutionId, itemId: objectKey });
            }

            case 'CreateInstitution': {

                const objectKey = UUID.newUUID();
                const objectValues = this.eventParser.getPayload();
                const keyedObject = { institutionId: institutionId, itemId: objectKey, ...objectValues};

                return this.putItem(injector, { institutionId: institutionId, itemId: objectKey }, keyedObject)
                .then((response: APIGatewayResponse) => {

                    if (response.statusCode === 200) { return ResponseBuilder.created('teste', keyedObject);
                    } else {return response; }

                });

            }

            case 'UpdateInstitution': {

                const objectKey = this.eventParser.getPathParam(this.httpPathParamId);
                const objectValues = this.eventParser.getPayload();

                /* tslint:disable no-dynamic-delete */
                delete objectValues[this.tableHashKey];
                return this.updateItem(injector, { institutionId: institutionId, itemId: objectKey }, objectValues);

            }

            case 'RemoveInstitution': {
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

}
