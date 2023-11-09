import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

describe('#Test Admin Endpoint', () => {
  const token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiIkMmIkMTAkL2VlazNtZ0tjUVRjQVZJUVpzU0pmT2liTWh0UGFSaXAyQVQ4VkdaSVZNbGFDSzhLSG41ZUMifSwiaWF0IjoxNjg4NzUyMjE0fQ.B5W5yrq__AZvCfE5xOAiCCsGaCK2O-fvyPA02ej5VGA';
  describe('#Login', () => {
    it('Login success', async () => {
      const response = await request
        .post('/admins/login')
        .send({ username: 'admin', password: '123456' });
      expect(response.status).toBe(200);
    });
  
    it('Login fail', async () => {
      const response = await request
        .post('/admins/login')
        .send({ username: 'admin', password: '1234567' });
      expect(response.status).toBe(401);
    });
  });
  

  describe('#Admin', () => {
    it('Admin list success', async () => {
      const response = await request.get('/admins').set('authorization', token);
      expect(response.status).toBe(200);
    });
  
    it('Admin list fail, un-authorize', async () => {
      const response = await request.get('/admins');
      expect(response.status).toBe(401);
    });
  
    it('Admin with id=1 success', async () => {
      const response = await request.get('/admins/1').set('authorization', token);
      expect(response.status).toBe(200);
    });
  
    it('Admin with id=1 fail, un-authorize', async () => {
      const response = await request.get('/admins/1');
      expect(response.status).toBe(401);
    });
  });

  describe('#Create', () => {
    it('Create Admin success', async () => {
      const response = await request
        .post('/admins')
        .set('authorization', token)
        .send({ username: 'admin3', password: '123456' });
      expect(response.status).toBe(200);
    });
  
    it('Create Admin fail, un-authorize', async () => {
      const response = await request
        .post('/admins')
        .send({ username: 'admin3', password: '123456' });
      expect(response.status).toBe(401);
    });
  });
});
