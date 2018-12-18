import { UUID, ResponseBuilder } from '../src/utilities';
import { expect, should } from 'chai';
import 'mocha';

describe('Utils Functions', () => {

  it('Utils Package Should generate Random Uuid', () => {
    const result = UUID.newUUID();
    should().exist(result);
  });

});

describe('ResponseBuilder', () => {

  it('ResponseBuilder should generate a 200 StatusCode for ok responses', () => {
    
    const payload = { id: 'id', name: 'Teste Name'};
    const response = ResponseBuilder.ok(payload)
    expect(response.statusCode).to.equal(200);

    const body = JSON.parse(response.body);
    expect(body).to.eqls(payload, 'Response Body is Not Equal Predicted!');

  });

  it('ResponseBuilder should generate a 201 StatusCode for created responses', () => {

    const url = 'https://'
    const payload = { id: 'id', name: 'Teste Name'};
    const response = ResponseBuilder.created(url, payload)
    expect(response.statusCode).to.equal(201);

    const body = JSON.parse(response.body);
    expect(body).to.eqls(payload, 'Response Body is Not Equal Predicted!');

    const headers = JSON.parse(JSON.stringify(response.headers));
    const location = headers['Location'];
    expect(location).to.eqls(url, 'Url from headers is not the same of url provided as parameterS!');

  });

  it('ResponseBuilder should generate a 500 StatusCode for InternalServerError responses', () => {
    const response = ResponseBuilder.internalError('test execution', 'correlationId');
    expect(response.statusCode).to.equal(500);
  });

  it('ResponseBuilder should generate a 403 StatusCode for Unauthorized responses', () => {
    const response = ResponseBuilder.forbidden('test execution', 'correlationId');
    expect(response.statusCode).to.equal(403);
  });

  it('ResponseBuilder should generate a 404 StatusCode for InternalServerError responses', () => {
    const response = ResponseBuilder.notFound('test execution', 'correlationId');
    expect(response.statusCode).to.equal(404);
  });

  it('ResponseBuilder should generate a 400 StatusCode for BadRequest responses', () => {
    const response = ResponseBuilder.badRequest('test execution', 'correlationId');
    expect(response.statusCode).to.equal(400);
  });

});