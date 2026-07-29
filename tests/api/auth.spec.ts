import { test, expect } from '../../src/fixtures/pages';

test.describe('RESTful Booker API — authentication', () => {
  test('should return a token for valid credentials', async ({ apiClient }) => {
    const result = await apiClient.authenticateRaw('admin', 'password123');

    expect(result.status).toBe(200);
    expect(result.json).toEqual(expect.objectContaining({ token: expect.any(String) }));
  });

  test('should reject invalid credentials', async ({ apiClient }) => {
    const result = await apiClient.authenticateRaw('admin', 'wrong-password');

    expect(result.status).toBe(200);
    expect(result.json).toEqual(expect.objectContaining({ reason: 'Bad credentials' }));
    expect(result.json).not.toEqual(expect.objectContaining({ token: expect.any(String) }));
  });
});
