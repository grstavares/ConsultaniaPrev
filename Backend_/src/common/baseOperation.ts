import { NoSQLTable, MessageBus, MetricBus, Logger, LogTag, DependencyInjector } from './backend';
import { BusinessEvent, InfrastructureMetric, APIGatewayResponse, ServiceError } from './types';
import { ResponseBuilder } from './utilities';

export class BaseOperations {

    constructor(public readonly traceId: string) { }

    public async queryItemByKeys(injector: DependencyInjector, keys: { [key: string]: any }): Promise<APIGatewayResponse> {

        return injector.getNoSQLTable()
        .then(async (table) => table.queryItemByHashKey(keys))
        .then((objects) => ResponseBuilder.ok(objects))
        .catch((reason: ServiceError) => ResponseBuilder.serviceError(reason, this.traceId));

    }

    public async queryItemsOnIndexByKeys(injector: DependencyInjector, indexName: string, keys: { [key: string]: any }): Promise<APIGatewayResponse> {

        return injector.getNoSQLTable()
        .then(async (table) => table.queryIndex(indexName, keys))
        .then((objects) => ResponseBuilder.ok(objects))
        .catch((reason: ServiceError) => ResponseBuilder.serviceError(reason, this.traceId));

    }

    public async getItem(injector: DependencyInjector, keys: { [key: string]: any }): Promise<APIGatewayResponse> {

        return injector.getNoSQLTable()
        .then(async (table) => table.getItem(keys))
        .then((objects) => ResponseBuilder.ok(objects))
        .catch((reason: ServiceError) => ResponseBuilder.serviceError(reason, this.traceId));

    }

    public async putItem(injector: DependencyInjector, keys: { [key: string]: any }, item: Object): Promise<APIGatewayResponse> {

        return injector.getNoSQLTable()
        .then(async (table) => table.putItem(keys, item))
        .then((result) => ResponseBuilder.ok(item))
        .catch((reason: ServiceError) => ResponseBuilder.serviceError(reason, this.traceId));

    }

    public async updateItem(injector: DependencyInjector, keys: { [key: string]: any }, values: { [key: string]: any }): Promise<APIGatewayResponse> {

        return injector.getNoSQLTable()
        .then(async (table) => table.updateItem(keys, values))
        .then((result) => ResponseBuilder.ok({}))
        .catch((reason: ServiceError) => ResponseBuilder.serviceError(reason, this.traceId));

    }

    public async deleteItem(injector: DependencyInjector, keys: { [key: string]: any }): Promise<APIGatewayResponse> {

        return injector.getNoSQLTable()
        .then(async (table) => table.deleteItems(keys))
        .then((result) => ResponseBuilder.ok({}))
        .catch((reason: ServiceError) => ResponseBuilder.serviceError(reason, this.traceId));

    }

    public async publishBusinessEvent(bus: MessageBus, event: BusinessEvent): Promise<string> { return bus.publish(event); }

    public async publishMetric(bus: MetricBus, event: InfrastructureMetric): Promise<boolean> { return bus.publish(event); }

    public publishTrace(tracer: Logger, tag: LogTag, message: Object) { tracer.log(tag, message); }

}
