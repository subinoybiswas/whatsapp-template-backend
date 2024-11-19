import request from 'supertest';

import app from '../src/app';

describe('POST /validate-template', () => {
  it('responds with a list of placeholders', async () => {
    const response = await request(app)
      .post('/validate-template')
      .send({ template: 'Hello, {{ name }}!' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: { placeholders: ['name'] },
    });
  });

  it('responds with an error for invalid template', async () => {
    const response = await request(app)
      .post('/validate-template')
      .send({ template: 'Hello, name!' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: 'Invalid template format',
    });
  });

  it('responds with an error for missing closing braces', async () => {
    const response = await request(app)
      .post('/validate-template')
      .send({ template: 'Hello, {{ name!' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: 'Invalid template format: missing closing "}}" for a placeholder',
    });
  });
});
//Generate Preview
describe('POST /generate-preview', () => {
  it('generates a preview with the provided variables', async () => {
    const response = await request(app)
      .post('/generate-preview')
      .send({
        template: 'Hello, {{ name }}!',
        variables: { name: 'John' },
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: { preview: 'Hello, John!' },
    });
  });

  it('responds with an error for missing variables', async () => {
    const response = await request(app)
      .post('/generate-preview')
      .send({
        template: 'Hello, {{ name }}!',
        variables: {},
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: 'Missing variable for placeholder: name',
    });
  });

  it('responds with an error for invalid variable value', async () => {
    const response = await request(app)
      .post('/generate-preview')
      .send({
        template: 'Hello, {{ name }}!',
        variables: { name: '' },
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: 'Invalid variable value for placeholder: name',
    });
  });

  it('responds with an error for missing closing braces in template', async () => {
    const response = await request(app)
      .post('/generate-preview')
      .send({
        template: 'Hello, {{ name!',
        variables: { name: 'John' },
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: 'Invalid template format: missing closing "}}" for a placeholder',
    });
  });

  it('responds with an error when no placeholders are found', async () => {
    const response = await request(app)
      .post('/generate-preview')
      .send({
        template: 'Hello, name!',
        variables: { name: 'John' },
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: 'No placeholders found in the template',
    });
  });
});
