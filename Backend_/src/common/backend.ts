import { BusinessEvent, InfrastructureMetric } from './types';

export enum BackendMetrics {
    DependencyNotConfigured = 'DependencyNotConfigured',
    DependencyNotAvailable = 'DependencyNotAvailable',
}

export enum LogTag {
    operation = 'TRACE',
    error = 'ERROR',
    warning = 'WARNING',
}

export interface NoSQLTable {
    getItem(keys: {[key: string]: any}): Promise<Object>;
    queryItemByHashKey(keys: {[key: string]: any}): Promise<Object[]>;
    putItem(keys: { [key: string]: any }, object: Object): Promise<boolean>;
    updateItem(keys: { [key: string]: any }, values: { [key: string]: any }): Promise<Object>;
    deleteItems(keys: { [key: string]: any }): Promise<boolean>;
    queryIndex(indexName: string, keys: { [key: string]: any }): Promise<Object[]>;
}

export interface MessageBus {
    publish(message: BusinessEvent): Promise<string>;
}

export interface MetricBus {
    publish(message: InfrastructureMetric): Promise<boolean>;
}

export interface Logger {
    log(tag: LogTag, message: Object): void;
}
export interface ParameterStore {
    get(path: string, name: string): string;
}

export interface InputParser {
    getHttpMethod(): string;
    getUserId(): string;
    getPathParam(name: string): string;
    getQueryParam(name: string): string;
    getResource(): string;
    getPayload(): Object;
}

export interface DependencyInjector {
    getNoSQLTable(): Promise<NoSQLTable>;
    getMessageBus(): Promise<MessageBus>;
    getMetricBus(): Promise<MetricBus>;
    getInputParser(event: any): InputParser;
}
