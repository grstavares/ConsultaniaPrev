"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Validators {
    static isValidEmail(value) { return new Promise((resolve, reject) => { resolve(true); }); }
    static isValidUUID(value) { return new Promise((resolve, reject) => { resolve(true); }); }
    static isValidAPIGatewayEvent(value) { return new Promise((resolve, reject) => { resolve(true); }); }
    static isValidSNSEvent(value) { return new Promise((resolve, reject) => { resolve(true); }); }
    static isValidSQSEvent(value) { return new Promise((resolve, reject) => { resolve(true); }); }
    static isValidS3Event(value) { return new Promise((resolve, reject) => { resolve(true); }); }
    static isValidDynamoEvent(value) { return new Promise((resolve, reject) => { resolve(true); }); }
    static isValidKinesisEvent(value) { return new Promise((resolve, reject) => { resolve(true); }); }
    static isValidTopicArn(arn) { return new Promise((resolve, reject) => { resolve(true); }); }
}
exports.Validators = Validators;
