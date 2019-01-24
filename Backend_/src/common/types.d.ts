export interface BusinessEvent {
    action: string;
    body: Object;
}

export interface InfrastructureMetricDimension {
    Name: string;
    Value: string;
}

export interface InfrastructureMetric {
    timestamp: Date;
    name: string;
    value: number;
    dimensions: InfrastructureMetricDimension[];
}

export interface ServiceError {
    type: string;
    code: string;
    httpStatusCode: number;
    resource?: string;
    payload?: Object;
}

export interface ServiceParameter {
    name: string;
    type: 'ENV' | 'SECRET' | 'STORE';
    isEncrypted?: boolean;
    path?: string;
}

export interface APIGatewayResponse {
    statusCode: number;
    headers?: {
        [header: string]: boolean | number | string;
    };
    multiValueHeaders?: {
        [header: string]: Array<boolean | number | string>;
    };
    body: string;
    isBase64Encoded?: boolean;
}
