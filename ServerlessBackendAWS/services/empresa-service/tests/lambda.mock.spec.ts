import { handler, injetResolver } from '../src/index'

import { expect, should } from 'chai';
import { mockEvent, mockGet, mockPost, mockPut, mockDelete } from './mocks/mock-events';
import { MockProxyResolver, MockTable, MockBucket, MockTopic, MockMetric, LocalDynamoConfiguration } from './mocks/mock-proxy';

import 'mocha';
import lambdaTester = require('lambda-tester');
import { ProxyTable, ProxyS3Bucket, ProxySnsTopic, ProxyResolver } from '../src/types';
import { AwsHelper } from '../src/aws-helper';
import { EnvironmentHelper } from '../src/utilities';

const lakeName = EnvironmentHelper.getParameter('SERVICE_LAKE_ARN') || 'thisBucket';
const tableName = EnvironmentHelper.getParameter('SERVICE_TABLE_ARN') || 'thisTable';
const topicArn = EnvironmentHelper.getParameter('SERVICE_TOPIC_ARN') || 'thisTopic';

describe('Lambda Function with Mock Backend', () => {

  var resolver: MockProxyResolver;
  const mockBucket: ProxyS3Bucket = new MockBucket()
  const mockTopic = new MockTopic()
  const mockMetric = new MockMetric();

  before(function (done) {

    this.timeout(10000);

    const dynamoconfig: LocalDynamoConfiguration = {
      tableNames: [tableName],
      tableKeys: [[{ AttributeName: 'id', KeyType: 'HASH' }]],
      tableAttributes: [[{ AttributeName: 'id', AttributeType: 'S' }]],
    }

    resolver = new MockProxyResolver(mockTopic, mockBucket, mockMetric);
    resolver.initDynamo(dynamoconfig).then(values => done());

  })

  it('Should Return Error when Mock is Not Injected', () => {

    return lambdaTester(handler).event(mockEvent).expectResult(result => {
      expect(500).to.eql(result.statusCode);
    }).catch(error => {console.log(error); expect(error).to.undefined});

  })

  it('Should Return StatusCode 201 with MockResolver and Correct Post Request', () => {

    resolver.clearErrors()
    injetResolver(resolver);

    expect(mockTopic.topicItems['thisTopic']).to.undefined;
    return lambdaTester(handler).event(mockPost).expectResult(result => {
      expect(201).to.eql(result.statusCode);
      expect(mockTopic.topicItems['thisTopic']).to.any;
    }).catch(error => {console.log(error); expect(error).to.undefined});

  });

  it('Should Get Back 404 when send an Get Request for a inexistent item', () => {

    var changed = Object.assign({}, mockGet)
    changed = Object.assign(changed, { path: '/instituto/65432' })

    resolver.clearErrors()
    injetResolver(resolver);
    return lambdaTester(handler).event(changed).expectResult(result => {
      expect(404).to.eql(result.statusCode);
    }).catch(error => {console.log(error); expect(error).to.undefined});

  });

  it('Should Get Back with 200 when send an Get Request', () => {

    resolver.clearErrors()
    const payload = JSON.parse(mockPost.body)
    resolver.injectObjectOnTable(tableName, payload)
    injetResolver(resolver);

    return lambdaTester(handler).event(mockGet).expectResult(result => {
      expect(200).to.eql(result.statusCode);
      expect(result.body).to.any;
      resolver.removeObjectFromTable(tableName, { id: payload['id']})
    }).catch(error => {console.log(error); expect(error).to.undefined});

  });

  it('Should Get Back with 201 when send an Post Request', () => {

    resolver.clearErrors()
    injetResolver(resolver);

    return lambdaTester(handler).event(mockPost).expectResult(result => {
      expect(201).to.eql(result.statusCode);
      expect(result.body).to.any;
      expect(result.headers['Location']).to.any;
    }).catch(error => expect(error).to.undefined);

  });

  it('Should Get Back with 200 when send an Put Request', () => {

    resolver.clearErrors()
    const payload = JSON.parse(mockPut.body);
    resolver.injectObjectOnTable(tableName, payload)
    injetResolver(resolver);

    return lambdaTester(handler).event(mockPut).expectResult(result => {
      expect(200).to.eql(result.statusCode);
      expect(result.body).to.any;
    }).catch(error => {console.log(error); expect(error).to.undefined});

  });

  it('Should Get Back with 200 when send an Delete Request', () => {

    resolver.clearErrors()
    const payload = JSON.parse(mockPut.body);
    resolver.injectObjectOnTable(tableName, payload)
    injetResolver(resolver);

    return lambdaTester(handler).event(mockDelete).expectResult(result => {
      expect(200).to.eql(result.statusCode);
      expect(result.body).to.null;
    }).catch(error => {console.log(error); expect(error).to.undefined});

  });

  it('Should Return StatusCode 400 when Request Body is not Valid', () => {

    resolver.clearErrors()
    injetResolver(resolver);

    var event = Object.assign({}, mockPost);
    event = Object.assign(event, { body: JSON.stringify({ message: 'invalid object' }) });

    return lambdaTester(handler).event(event).expectResult(result => {
      expect(400).to.eql(result.statusCode);
    }).catch(error => {console.log(error); expect(error).to.undefined});

  });

  it('Should Return StatusCode 500 when Table is Not Available', () => {

    resolver.injectError({table: true, topic: false, bucket: false, metric: false})
    injetResolver(resolver);

    expect(mockMetric.metricValues['DependencyNotAvailable']).to.undefined;
    return lambdaTester(handler).event(mockEvent).expectResult(result => {
      expect(500).to.eql(result.statusCode);
      expect(1).to.eql(mockMetric.metricValues['DependencyNotAvailable']);
    }).catch(error => {console.log(error); expect(error).to.undefined});

  });

  it('Should Return StatusCode 500 when Bucket is Not Available', () => {

    resolver.injectError({table: false, topic: false, bucket: true, metric: false})
    injetResolver(resolver);

    expect(mockMetric.metricValues['DependencyNotAvailable']).to.undefined;
    return lambdaTester(handler).event(mockEvent).expectResult(result => {
      expect(500).to.eql(result.statusCode);
      expect(1).to.eql(mockMetric.metricValues['DependencyNotAvailable']);
    }).catch(error => {console.log(error); expect(error).to.undefined});

  });

  it('Should Return StatusCode 500 when Topic is Not Available', () => {

    resolver.injectError({table: false, topic: true, bucket: false, metric: false})
    injetResolver(resolver);

    expect(mockMetric.metricValues['DependencyNotAvailable']).to.undefined;
    return lambdaTester(handler).event(mockEvent).expectResult(result => {
      expect(500).to.eql(result.statusCode);
      expect(1).to.eql(mockMetric.metricValues['DependencyNotAvailable']);
    }).catch(error => {console.log(error); expect(error).to.undefined});

  });

  it('Should Return StatusCode 500 when Metric is Not Available', () => {

    resolver.injectError({table: false, topic: false, bucket: false, metric: true})
    injetResolver(resolver);

    expect(mockMetric.metricValues['DependencyNotAvailable']).to.undefined;
    return lambdaTester(handler).event(mockEvent).expectResult(result => {
      expect(500).to.eql(result.statusCode);
      expect(1).to.eql(mockMetric.metricValues['DependencyNotAvailable']);
    }).catch(error => {console.log(error); expect(error).to.undefined});

  });

  after(() => {
    resolver.finish();
  })

});