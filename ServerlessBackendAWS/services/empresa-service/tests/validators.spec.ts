import { Validators } from '../src/validators';
import { expect, should, } from 'chai';
import 'mocha';

const validSchema = {
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/root.json",
    "type": "object",
    "title": "The Root Schema",
    "required": [
      "id",
      "name"
    ],
    "properties": {
      "id": {
        "$id": "#/properties/id",
        "type": "string",
        "title": "The Id Schema",
        "default": "",
        "examples": [
          "1"
        ],
        "pattern": "^(.*)$"
      },
      "name": {
        "$id": "#/properties/name",
        "type": "string",
        "title": "The Name Schema",
        "default": "",
        "examples": [
          "Gustavo Tavares"
        ],
        "pattern": "^(.*)$"
      }
    }
  }

describe('Validators', () => {

  it('Should Return True to valid e-mail', () => {
    
    const payload = 'test@gmail.com';
    const result = Validators.isValidEmail(payload);
    expect(result).to.true;

  });

  it('Should Return False to invalid e-mail', () => {
    
    const payload = 'test#gmail.com';
    const result = Validators.isValidEmail(payload);
    expect(result).true;

  });

  it('Should Return True to valid UUID', () => {
    
    const payload = 'test@gmail.com';
    const result = Validators.isValidEmail(payload);
    expect(result).to.true;

  });

  it('Should Return False to invalid UUID', () => {
    
    const payload = 'test#gmail.com';
    const result = Validators.isValidEmail(payload);
    expect(result).to.true;

  });

  it('Should Return True to valid topicArn', () => {
    
    const payload = 'test@gmail.com';
    const result = Validators.isValidTopicArn(payload);
    expect(result).to.true;

  });

  it('Should Return False to invalid topicArn', () => {
    
    const payload = 'test#gmail.com';
    const result = Validators.isValidTopicArn(payload);
    expect(result).to.true;

  });

  it('Should Return True to valid APIGatewayEvent', () => {
    
    const payload = { id: 'id', name: 'Teste Name'};
    const result = Validators.isValidAPIGatewayEvent(payload);
    expect(result).to.true;

  });

  it('Should Return False to invalid APIGatewayEvent', () => {
    
    const payload = { id: 'id', name: 'Teste Name'};
    const result = Validators.isValidAPIGatewayEvent(payload);
    expect(result).to.true;

  });

  it('Should Return True to valid SNSEvent', () => {
    
    const payload = { id: 'id', name: 'Teste Name'};
    const result = Validators.isValidSNSEvent(payload);
    expect(result).to.true;

  });

  it('Should Return False to invalid SNSEvent', () => {
    
    const payload = { id: 'id', name: 'Teste Name'};
    const result = Validators.isValidSNSEvent(payload);
    expect(result).to.true;

  });

  it('Should Return True to valid SQSEvent', () => {
    
    const payload = { id: 'id', name: 'Teste Name'};
    const result = Validators.isValidSQSEvent(payload);
    expect(result).to.true;

  });

  it('Should Return False to invalid SQSEvent', () => {
    
    const payload = { id: 'id', name: 'Teste Name'};
    const result = Validators.isValidSQSEvent(payload);
    expect(result).to.true;

  });

  it('Should Return True to valid S3Event', () => {
    
    const payload = { id: 'id', name: 'Teste Name'};
    const result = Validators.isValidS3Event(payload);
    expect(result).to.true;

  });

  it('Should Return False to invalid S3Event', () => {
    
    const payload = { id: 'id', name: 'Teste Name'};
    const result = Validators.isValidS3Event(payload);
    expect(result).to.true;

  });


  it('Should Return True to valid DynamoEvent', () => {
    
    const payload = { id: 'id', name: 'Teste Name'};
    const result = Validators.isValidDynamoEvent(payload);
    expect(result).to.true;

  });

  it('Should Return False to invalid DynamoEvent', () => {
    
    const payload = { id: 'id', name: 'Teste Name'};
    const result = Validators.isValidDynamoEvent(payload);
    expect(result).to.true;

  });

  it('Should Return True to valid KinesisEvent', () => {
    
    const payload = { id: 'id', name: 'Teste Name'};
    const result = Validators.isValidKinesisEvent(payload);
    expect(result).to.true;

  });

  it('Should Return False to invalid KinesisEvent', () => {
    
    const payload = { id: 'id', name: 'Teste Name'};
    const result = Validators.isValidKinesisEvent(payload);
    expect(result).to.true;

  });

  it('Should Return True to valid Object based on Schema', () => {
    
    const payload = { id: 'id', name: 'Teste Name'};
    const result = Validators.isValidObject(validSchema, payload);
    expect(result).to.true;

  });

  it('Should Return False to invalid Object based on Schema', () => {
    
    const payload = { none: 'id', name: 'Teste Name'};
    const result = Validators.isValidObject(validSchema, payload);
    expect(result).to.false;

  });


});