import { Context } from 'aws-lambda';

export const mockContext: Context = {
    callbackWaitsForEmptyEventLoop: true,
    logGroupName: "/aws/lambda/TestFunctionAndEvent",
    logStreamName: "2018/12/17/[$LATEST]70788d4f56b4419284445b4b4a56f241",
    functionName: "TestFunctionAndEvent",
    memoryLimitInMB: 128,
    functionVersion: "$LATEST",
    awsRequestId: "ccc4f019-01f3-11e9-b390-ddba96f8c1d3",
    invokedFunctionArn: "arn:aws:lambda:sa-east-1:831559051193:function:TestFunctionAndEvent",
    getRemainingTimeInMillis: () => {return 5},
    // Functions for compatibility with earlier Node.js Runtime v0.10.42
    // For more details see http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-using-old-runtime.html#nodejs-prog-model-oldruntime-context-methods
    done:(error?: Error, result?: any) => {return},
    fail:(error: Error | string) => {return},
    succeed:(messageOrObject: any) => {return}
};