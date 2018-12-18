import { handler, injetResolver } from '../src/index'

import { expect, should } from 'chai';
import { mockEvent, mockGet, mockPost, mockPut, mockDelete } from './mocks/mock-events';
import { MockProxyResolver, MockTable, MockBucket, MockTopic, MockMetric } from './mocks/mock-proxy';

import 'mocha';
import lambdaTester = require('lambda-tester');
import { ProxyTable, ProxyS3Bucket, ProxySnsTopic, ProxyResolver } from '../src/types';
import { AwsHelper } from '../src/aws-helper';

describe('Lambda Function with Mock Backend', () => {

  it('Should Return Error when Mock is Not Injected', () => {

    return lambdaTester(handler).event(mockEvent).expectResult(result => {
      expect(500).to.eql(result.statusCode);
    });

  })

  it('Should Return StatusCode 201 with MockResolver and Correct Post Request', () => {

    const mockTable: ProxyTable = new MockTable()
    const mockBucket: ProxyS3Bucket = new MockBucket()
    const mockTopic = new MockTopic()
    const mockMetric = new MockMetric();
    const mockResolver = new MockProxyResolver(mockTopic, mockBucket, mockMetric, mockTable);
    injetResolver(mockResolver);

    expect(mockTopic.topicItems['thisTopic']).to.undefined;
    return lambdaTester(handler).event(mockPost).expectResult(result => {
      expect(201).to.eql(result.statusCode);
      expect(mockTopic.topicItems['thisTopic']).to.any;
    });

  });

  it('Should Get Back 404 when send an Get Request for a inexistent item', () => {

    const mockTable: MockTable = new MockTable();
    const mockBucket: ProxyS3Bucket = new MockBucket();
    const mockTopic: ProxySnsTopic = new MockTopic();
    const mockMetric = new MockMetric();
    const mockResolver = new MockProxyResolver(mockTopic, mockBucket, mockMetric, mockTable);

    var changed = Object.assign({}, mockGet)
    changed = Object.assign(changed, { path: '/instituto/65432' })

    injetResolver(mockResolver);
    return lambdaTester(handler).event(changed).expectResult(result => {
      expect(404).to.eql(result.statusCode);
    });

  });

  it('Should Get Back with 200 when send an Get Request', () => {

    const mockTable: MockTable = new MockTable();
    const mockBucket: ProxyS3Bucket = new MockBucket();
    const mockTopic: ProxySnsTopic = new MockTopic();
    const mockMetric = new MockMetric();
    const mockResolver = new MockProxyResolver(mockTopic, mockBucket, mockMetric, mockTable);

    injetResolver(mockResolver);

    const payload = AwsHelper.marshalObject(JSON.parse(mockPost.body));
    const objectId = '12345';
    mockTable.tableItems[objectId] = payload;

    return lambdaTester(handler).event(mockGet).expectResult(result => {
      expect(200).to.eql(result.statusCode);
      expect(result.body).to.any;
    });

  });

  it('Should Get Back with 201 when send an Post Request', () => {

    const mockTable: MockTable = new MockTable();
    const mockBucket: ProxyS3Bucket = new MockBucket();
    const mockTopic: ProxySnsTopic = new MockTopic();
    const mockMetric = new MockMetric();
    const mockResolver = new MockProxyResolver(mockTopic, mockBucket, mockMetric, mockTable);

    injetResolver(mockResolver);

    return lambdaTester(handler).event(mockPost).expectResult(result => {
      expect(201).to.eql(result.statusCode);
      expect(result.body).to.any;
      expect(result.headers['Location']).to.any;
    });

  });

  it('Should Get Back with 200 when send an Put Request', () => {

    const mockTable: MockTable = new MockTable();
    const mockBucket: ProxyS3Bucket = new MockBucket();
    const mockTopic: ProxySnsTopic = new MockTopic();
    const mockMetric = new MockMetric();
    const mockResolver = new MockProxyResolver(mockTopic, mockBucket, mockMetric, mockTable);

    injetResolver(mockResolver);

    const payload = AwsHelper.marshalObject(JSON.parse(mockPost.body));
    const objectId = '12345';
    mockTable.tableItems[objectId] = payload;

    return lambdaTester(handler).event(mockPut).expectResult(result => {
      expect(200).to.eql(result.statusCode);
      expect(result.body).to.any;
    });

  });

  it('Should Get Back with 200 when send an Delete Request', () => {

    const mockTable: MockTable = new MockTable();
    const mockBucket: ProxyS3Bucket = new MockBucket();
    const mockTopic: ProxySnsTopic = new MockTopic();
    const mockMetric = new MockMetric();
    const mockResolver = new MockProxyResolver(mockTopic, mockBucket, mockMetric, mockTable);

    injetResolver(mockResolver);

    const payload = AwsHelper.marshalObject(JSON.parse(mockPost.body));
    const objectId = '12345';
    mockTable.tableItems[objectId] = payload;

    expect(mockTable.tableItems[objectId]).to.any
    return lambdaTester(handler).event(mockDelete).expectResult(result => {
      expect(200).to.eql(result.statusCode);
      expect(mockTable.tableItems[objectId]).to.undefined
      expect(result.body).to.null;
    });

  });

  it('Should Return StatusCode 400 when Request Body is not Valid', () => {

    const mockTable: ProxyTable = new MockTable();
    const mockBucket: ProxyS3Bucket = new MockBucket();
    const mockTopic: ProxySnsTopic = new MockTopic();
    const mockMetric = new MockMetric();
    const mockResolver = new MockProxyResolver(mockTopic, mockBucket, mockMetric, mockTable);
    injetResolver(mockResolver);

    var event = Object.assign({}, mockPost);
    event = Object.assign(event, { body: JSON.stringify({ message: 'invalid object' }) });

    return lambdaTester(handler).event(event).expectResult(result => {
      expect(400).to.eql(result.statusCode);
    });

  });

  it('Should Return StatusCode 500 when Table is Not Available', () => {

    const mockTable: ProxyTable = null;
    const mockBucket: ProxyS3Bucket = new MockBucket();
    const mockTopic: ProxySnsTopic = new MockTopic();
    const mockMetric = new MockMetric();
    const mockResolver = new MockProxyResolver(mockTopic, mockBucket, mockMetric, mockTable);
    injetResolver(mockResolver);

    expect(mockMetric.metricValues['DependencyNotAvailable']).to.undefined;
    return lambdaTester(handler).event(mockEvent).expectResult(result => {
      expect(500).to.eql(result.statusCode);
      expect(1).to.eql(mockMetric.metricValues['DependencyNotAvailable']);
    });

  });

  it('Should Return StatusCode 500 when Bucket is Not Available', () => {

    const mockTable: ProxyTable = new MockTable();
    const mockBucket: ProxyS3Bucket = null;
    const mockTopic: ProxySnsTopic = new MockTopic();
    const mockMetric = new MockMetric();
    const mockResolver = new MockProxyResolver(mockTopic, mockBucket, mockMetric, mockTable);
    injetResolver(mockResolver);

    expect(mockMetric.metricValues['DependencyNotAvailable']).to.undefined;
    return lambdaTester(handler).event(mockEvent).expectResult(result => {
      expect(500).to.eql(result.statusCode);
      expect(1).to.eql(mockMetric.metricValues['DependencyNotAvailable']);
    });

  });

  it('Should Return StatusCode 500 when Topic is Not Available', () => {

    const mockTable: ProxyTable = new MockTable();
    const mockBucket: ProxyS3Bucket = new MockBucket();
    const mockTopic: ProxySnsTopic = null;
    const mockMetric = new MockMetric();
    const mockResolver = new MockProxyResolver(mockTopic, mockBucket, mockMetric, mockTable);
    injetResolver(mockResolver);

    expect(mockMetric.metricValues['DependencyNotAvailable']).to.undefined;
    return lambdaTester(handler).event(mockEvent).expectResult(result => {
      expect(500).to.eql(result.statusCode);
      expect(1).to.eql(mockMetric.metricValues['DependencyNotAvailable']);
    });

  });

  it('Should Return StatusCode 500 when Table is Not Available', () => {

    const mockTable: ProxyTable = null;
    const mockBucket: ProxyS3Bucket = new MockBucket();
    const mockTopic: ProxySnsTopic = new MockTopic();
    const mockMetric = new MockMetric();
    const mockResolver = new MockProxyResolver(mockTopic, mockBucket, mockMetric, mockTable);
    injetResolver(mockResolver);

    expect(mockMetric.metricValues['DependencyNotAvailable']).to.undefined;
    return lambdaTester(handler).event(mockEvent).expectResult(result => {
      expect(500).to.eql(result.statusCode);
      expect(1).to.eql(mockMetric.metricValues['DependencyNotAvailable']);
    });

  });

});