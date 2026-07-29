import { test, expect } from '../../src/fixtures/pages';

test.describe('RESTful Booker API — health', () => {
  test('should return 201 Created from the ping endpoint', async ({ apiClient }) => {
    const result = await apiClient.ping();

    expect(result.status).toBe(201);
    expect(result.body).toMatch(/created/i);
  });
});
