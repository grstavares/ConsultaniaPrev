/* tslint:disable: no-implicit-dependencies */
import { Context } from 'aws-lambda';
import { MessageBus, MetricBus, NoSQLTable, BackendMetrics, InputParser } from '../common/backend';
import { ErrorBuilder, ResponseBuilder, MetricBuilder, HttpStatusCode } from '../common/utilities';
import { InfrastructureMetric } from '../common/types';
import { DynamoDBTable, AWSTopic, AWSMetricPublisher, AWSParser } from '.';

export enum DependencyInjectorError {
    DependencyNotAvailable = 'DependencyNotAvailable',
    DependencyNotConfigured = 'DependencyNotConfigured',
}

export class AWSDependencyInjector {

    private readonly errorType = 'InjectorError';
    private readonly traceId: string;

    constructor(private readonly context: Context) { this.traceId = context.awsRequestId; }

    public async getNoSQLTable(): Promise<NoSQLTable> {

        const tablename = process.env.DYNAMO_TABLE_NAME;
        if (tablename === null || tablename == undefined) {

            const serviceError = new ErrorBuilder(this.errorType, DependencyInjectorError.DependencyNotConfigured, HttpStatusCode.internalServerError).withResource('NoSQLTable').build();
            const metric = new MetricBuilder(BackendMetrics.DependencyNotConfigured, 1).withResourceType('NoSQLTable').build();

            console.log(serviceError);
            return this.tryToPublishMetric(metric)
            .then(async (result) => Promise.reject(serviceError))
            .catch(async (publishError) => Promise.reject(serviceError));

        } else { return new DynamoDBTable(tablename); }

    }

    public async getMessageBus(): Promise<MessageBus> {

        const topicarn = process.env.SNS_TOPIC_ARN;
        if (topicarn === null || topicarn == undefined) {

            const error = new ErrorBuilder(this.errorType, DependencyInjectorError.DependencyNotConfigured, HttpStatusCode.internalServerError).withResource('SNSTopic').build();
            const response = ResponseBuilder.internalError(error.code, this.traceId);
            const metric = new MetricBuilder(BackendMetrics.DependencyNotConfigured, 1).withResourceType('SNSTopic').build();

            console.log(error);
            return this.tryToPublishMetric(metric)
            .then(async (result) => Promise.reject(response))
            .catch(async (publishError) => Promise.reject(response));

        }

        return new AWSTopic(topicarn);

    }

    public async getMetricBus(): Promise<MetricBus> {

        return new AWSMetricPublisher(this.context);

    }

    public getInputParser(event: any): InputParser {

        /* tslint:disable no-unsafe-any*/
        return AWSParser.parseAPIGatewayEvent(event);

    }

    private async tryToPublishMetric(metric: InfrastructureMetric): Promise<boolean> {

        return this.getMetricBus().then(async (metricbus) => metricbus.publish(metric));

    }

}
