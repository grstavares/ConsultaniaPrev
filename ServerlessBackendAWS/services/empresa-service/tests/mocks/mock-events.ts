import { APIGatewayProxyEvent } from 'aws-lambda';

export const mockPost = {
    "resource": "/instituto",
    "path": "/instituto",
    "httpMethod": "POST",
    "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "pt-br",
        "Content-Type": "application/json",
        "Host": "8brfalsele.execute-api.sa-east-1.amazonaws.com",
        "User-Agent": "Rested/2009 CFNetwork/902.3.1 Darwin/17.7.0 (x86_64)",
        "X-Amzn-Trace-Id": "Root=1-5c195cea-d2aa9a8f16df1a7ef8372804",
        "X-Forwarded-For": "177.235.73.126",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
    },
    "multiValueHeaders": {
        "Accept": [ "*/*" ],
        "Accept-Encoding": [ "gzip, deflate" ],
        "Accept-Language": [ "pt-br" ],
        "Content-Type": [ "application/json" ],
        "Host": [ "8brfalsele.execute-api.sa-east-1.amazonaws.com" ],
        "User-Agent": [ "Rested/2009 CFNetwork/902.3.1 Darwin/17.7.0 (x86_64)" ],
        "X-Amzn-Trace-Id": [ "Root=1-5c195cea-d2aa9a8f16df1a7ef8372804" ],
        "X-Forwarded-For": [ "177.235.73.126" ],
        "X-Forwarded-Port": [ "443" ],
        "X-Forwarded-Proto": [ "https" ]
    },
    "queryStringParameters": null,
    "multiValueQueryStringParameters": null,
    "pathParameters": null,
    "stageVariables": null,
    "requestContext": {
        "resourceId": "46msjn",
        "resourcePath": "/instituto",
        "httpMethod": "POST",
        "extendedRequestId": "SHt0pFu5GjQFdOQ=",
        "requestTime": "18/Dec/2018:20:47:38 +0000",
        "path": "/beta/instituto",
        "accountId": "839900887793",
        "protocol": "HTTP/1.1",
        "stage": "beta",
        "domainPrefix": "8brfalsele",
        "requestTimeEpoch": 1545166058504,
        "requestId": "27dd91fc-0306-11e9-9db3-cd21f64cd30a",
        "identity": {
            "cognitoIdentityPoolId": null,
            "accountId": null,
            "cognitoIdentityId": null,
            "caller": null,
            "sourceIp": "177.235.73.126",
            "accessKey": null,
            "cognitoAuthenticationType": null,
            "cognitoAuthenticationProvider": null,
            "userArn": null,
            "userAgent": "Rested/2009 CFNetwork/902.3.1 Darwin/17.7.0 (x86_64)",
            "user": null
        },
        "domainName": "8brfalsele.execute-api.sa-east-1.amazonaws.com",
        "apiId": "8brfalsele"
    },
    "body": "{\n \"id\":\"12345POST987\",\n \"name\": \"Novo Teste\",\n  \"birthDate\": \"16-11-1944\",\n  \"addresses\": []\n}",
    "isBase64Encoded": false
}

export const mockGet = {
  "resource": "/instituto/{id}",
  "path": "/instituto/12345POST987",
  "httpMethod": "GET",
  "headers": {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "pt-br",
      "Content-Type": "application/json",
      "Host": "8brfalsele.execute-api.sa-east-1.amazonaws.com",
      "User-Agent": "Rested/2009 CFNetwork/902.3.1 Darwin/17.7.0 (x86_64)",
      "X-Amzn-Trace-Id": "Root=1-5c1945b2-29345fc5cd8d4df3761173ad",
      "X-Forwarded-For": "177.235.73.126",
      "X-Forwarded-Port": "443",
      "X-Forwarded-Proto": "https"
  },
  "multiValueHeaders": {
      "Accept": [ "*/*" ],
      "Accept-Encoding": [ "gzip, deflate" ],
      "Accept-Language": [ "pt-br" ],
      "Content-Type": [ "application/json" ],
      "Host": [ "8brfalsele.execute-api.sa-east-1.amazonaws.com" ],
      "User-Agent": [ "Rested/2009 CFNetwork/902.3.1 Darwin/17.7.0 (x86_64)" ],
      "X-Amzn-Trace-Id": [ "Root=1-5c1945b2-29345fc5cd8d4df3761173ad" ],
      "X-Forwarded-For": [ "177.235.73.126" ],
      "X-Forwarded-Port": [ "443" ],
      "X-Forwarded-Proto": [ "https" ]
  },
  "queryStringParameters": null,
  "multiValueQueryStringParameters": null,
  "pathParameters": { "id": "12345POST987" },
  "stageVariables": null,
  "requestContext": {
      "resourceId": "tanbkk",
      "resourcePath": "/instituto/{id}",
      "httpMethod": "GET",
      "extendedRequestId": "SHfT0F4SmjQFQfA=",
      "requestTime": "18/Dec/2018:19:08:34 +0000",
      "path": "/beta/instituto/12345POST987",
      "accountId": "839900887793",
      "protocol": "HTTP/1.1",
      "stage": "beta",
      "domainPrefix": "8brfalsele",
      "requestTimeEpoch": 1545160114034,
      "requestId": "50af957d-02f8-11e9-9a1e-29795599f8b5",
      "identity": {
          "cognitoIdentityPoolId": null,
          "accountId": null,
          "cognitoIdentityId": null,
          "caller": null,
          "sourceIp": "177.000.73.126",
          "accessKey": null,
          "cognitoAuthenticationType": null,
          "cognitoAuthenticationProvider": null,
          "userArn": null,
          "userAgent": "Rested/2009 CFNetwork/902.3.1 Darwin/17.7.0 (x86_64)",
          "user": null
      },
      "domainName": "8brfalsele.execute-api.sa-east-1.amazonaws.com",
      "apiId": "8brfalsele"
  },
  "body": null,
  "isBase64Encoded": false
}

export const mockDelete = {
  "resource": "/instituto/{id}",
  "path": "/instituto/12345PUT4433",
  "httpMethod": "DELETE",
  "headers": {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "pt-br",
      "Content-Type": "application/json",
      "Host": "8brfalsele.execute-api.sa-east-1.amazonaws.com",
      "User-Agent": "Rested/2009 CFNetwork/902.3.1 Darwin/17.7.0 (x86_64)",
      "X-Amzn-Trace-Id": "Root=1-5c194598-567fd0a9d1b574f7340e124a",
      "X-Forwarded-For": "177.235.73.126",
      "X-Forwarded-Port": "443",
      "X-Forwarded-Proto": "https"
  },
  "multiValueHeaders": {
      "Accept": [ "*/*" ],
      "Accept-Encoding": [ "gzip, deflate" ],
      "Accept-Language": [ "pt-br" ],
      "Content-Type": [ "application/json" ],
      "Host": [ "8brfalsele.execute-api.sa-east-1.amazonaws.com" ],
      "User-Agent": [ "Rested/2009 CFNetwork/902.3.1 Darwin/17.7.0 (x86_64)" ],
      "X-Amzn-Trace-Id": [ "Root=1-5c194598-567fd0a9d1b574f7340e124a" ],
      "X-Forwarded-For": [ "177.235.73.126" ],
      "X-Forwarded-Port": [ "443" ],
      "X-Forwarded-Proto": [ "https" ]
  },
  "queryStringParameters": null,
  "multiValueQueryStringParameters": null,
  "pathParameters": { "id": "12345PUT4433" },
  "stageVariables": null,
  "requestContext": {
      "resourceId": "tanbkk",
      "resourcePath": "/instituto/{id}",
      "httpMethod": "DELETE",
      "extendedRequestId": "SHfP4GDIGjQFbOA=",
      "requestTime": "18/Dec/2018:19:08:08 +0000",
      "path": "/beta/instituto/12345PUT4433",
      "accountId": "839900887793",
      "protocol": "HTTP/1.1",
      "stage": "beta",
      "domainPrefix": "8brfalsele",
      "requestTimeEpoch": 1545160088874,
      "requestId": "41b07934-02f8-11e9-bce8-efe888938bba",
      "identity": {
          "cognitoIdentityPoolId": null,
          "accountId": null,
          "cognitoIdentityId": null,
          "caller": null,
          "sourceIp": "177.000.73.126",
          "accessKey": null,
          "cognitoAuthenticationType": null,
          "cognitoAuthenticationProvider": null,
          "userArn": null,
          "userAgent": "Rested/2009 CFNetwork/902.3.1 Darwin/17.7.0 (x86_64)",
          "user": null
      },
      "domainName": "8brfalsele.execute-api.sa-east-1.amazonaws.com",
      "apiId": "8brfalsele"
  },
  "body": null,
  "isBase64Encoded": false
}

export const mockPut = {
    "resource": "/instituto/{id}",
    "path": "/instituto/12345PUT4433",
    "httpMethod": "PUT",
    "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "pt-br",
        "Content-Type": "application/json",
        "Host": "8brfalsele.execute-api.sa-east-1.amazonaws.com",
        "User-Agent": "Rested/2009 CFNetwork/902.3.1 Darwin/17.7.0 (x86_64)",
        "X-Amzn-Trace-Id": "Root=1-5c195d98-967f8749d7c823831f87fc39",
        "X-Forwarded-For": "177.235.73.126",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
    },
    "multiValueHeaders": {
        "Accept": [ "*/*" ],
        "Accept-Encoding": [ "gzip, deflate" ],
        "Accept-Language": [ "pt-br" ],
        "Content-Type": [ "application/json" ],
        "Host": [ "8brfalsele.execute-api.sa-east-1.amazonaws.com" ],
        "User-Agent": [ "Rested/2009 CFNetwork/902.3.1 Darwin/17.7.0 (x86_64)" ],
        "X-Amzn-Trace-Id": [ "Root=1-5c195d98-967f8749d7c823831f87fc39" ],
        "X-Forwarded-For": [ "177.235.73.126" ],
        "X-Forwarded-Port": [ "443" ],
        "X-Forwarded-Proto": [ "https" ]
    },
    "queryStringParameters": null,
    "multiValueQueryStringParameters": null,
    "pathParameters": {
        "id": "12345PUT4433"
    },
    "stageVariables": null,
    "requestContext": {
        "resourceId": "tanbkk",
        "resourcePath": "/instituto/{id}",
        "httpMethod": "PUT",
        "extendedRequestId": "SHuPyGugmjQFaSA=",
        "requestTime": "18/Dec/2018:20:50:32 +0000",
        "path": "/beta/instituto/12345PUT4433",
        "accountId": "839900887793",
        "protocol": "HTTP/1.1",
        "stage": "beta",
        "domainPrefix": "8brfalsele",
        "requestTimeEpoch": 1545166232299,
        "requestId": "8f74bc1f-0306-11e9-820b-8159f7adeb67",
        "identity": {
            "cognitoIdentityPoolId": null,
            "accountId": null,
            "cognitoIdentityId": null,
            "caller": null,
            "sourceIp": "177.000.73.126",
            "accessKey": null,
            "cognitoAuthenticationType": null,
            "cognitoAuthenticationProvider": null,
            "userArn": null,
            "userAgent": "Rested/2009 CFNetwork/902.3.1 Darwin/17.7.0 (x86_64)",
            "user": null
        },
        "domainName": "8brfalsele.execute-api.sa-east-1.amazonaws.com",
        "apiId": "8brfalsele"
    },
    "body": "{\n \"id\":\"12345PUT4433\",\n \"name\": \"Novo Teste\",\n  \"birthDate\": \"16-11-1944\",\n  \"addresses\": []\n}",
    "isBase64Encoded": false
}


export const mockEvent: APIGatewayProxyEvent = {
  "body": "{\"id\":\"eyJ0ZXN0IjoiYm9keSJ9\", \"name\":\"Gustavo Tavares\", \"birthDate\":\"15-11-1977\", \"addresses\": [ { \"cep\": \"71915-250\", \"city\":\"Brasília\" }, { \"cep\": \"74110-090\", \"city\":\"Goiânia\" }], \"parametros\": { \"senha\": \"aquela\", \"tela\": \"principal\" } }",
  "resource": "/{proxy+}",
  "path": "/path/to/resource",
  "httpMethod": "POST",
  "isBase64Encoded": true,
  "queryStringParameters": {
    "foo": "bar"
  },
  "pathParameters": {
    "proxy": "/path/to/resource"
  },
  "stageVariables": {
    "baz": "qux"
  },
  "headers": {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, sdch",
    "Accept-Language": "en-US,en;q=0.8",
    "Cache-Control": "max-age=0",
    "CloudFront-Forwarded-Proto": "https",
    "CloudFront-Is-Desktop-Viewer": "true",
    "CloudFront-Is-Mobile-Viewer": "false",
    "CloudFront-Is-SmartTV-Viewer": "false",
    "CloudFront-Is-Tablet-Viewer": "false",
    "CloudFront-Viewer-Country": "US",
    "Host": "1234567890.execute-api.sa-east-1.amazonaws.com",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Custom User Agent String",
    "Via": "1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)",
    "X-Amz-Cf-Id": "cDehVQoZnx43VYQb9j2-nvCh-9z396Uhbp027Y2JvkCPNLmGJHqlaA==",
    "X-Forwarded-For": "127.0.0.1, 127.0.0.2",
    "X-Forwarded-Port": "443",
    "X-Forwarded-Proto": "https"
  },
  "multiValueHeaders": {},
  "multiValueQueryStringParameters": null,
  "requestContext": {
    "accountId": "123456789012",
    "resourceId": "123456",
    "stage": "prod",
    "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
    "requestTimeEpoch": 1428582896000,
    "identity": {
      "apiKey": null,
      "apiKeyId": null,
      "cognitoIdentityPoolId": null,
      "accountId": null,
      "cognitoIdentityId": null,
      "caller": null,
      "accessKey": null,
      "sourceIp": "127.0.0.1",
      "cognitoAuthenticationType": null,
      "cognitoAuthenticationProvider": null,
      "userArn": null,
      "userAgent": "Custom User Agent String",
      "user": null
    },
    "path": "/prod/path/to/resource",
    "resourcePath": "/{proxy+}",
    "httpMethod": "POST",
    "apiId": "1234567890"
  }
}