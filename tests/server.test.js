const request = require('supertest');
const { app, server } = require('../app');

describe('Server Basic Test', () => {
    afterAll((done) => {
        server.close(done);
    });

    it('should be running and return 404 for unknown routes', async () => {
        const response = await request(app).get('/unknown');
        expect(response.status).toBe(404);
    });
});
