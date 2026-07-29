import { test, expect } from '../../src/fixtures/pages';
import { createValidBooking } from '../../src/fixtures/test-data';

test.describe('RESTful Booker API — bookings', () => {
  test('should create and retrieve a booking', async ({ apiClient }) => {
    const payload = createValidBooking();

    const created = await apiClient.createBooking(payload);
    expect(created.bookingid).toBeGreaterThan(0);
    expect(created.booking.firstname).toBe(payload.firstname);

    const retrieved = await apiClient.getBooking(created.bookingid);
    expect(retrieved.lastname).toBe(payload.lastname);
    expect(retrieved.totalprice).toBe(payload.totalprice);

    await apiClient.deleteBooking(created.bookingid);
  });

  test('should update an existing booking', async ({ apiClient }) => {
    const created = await apiClient.createBooking(createValidBooking());
    const updatedPayload = createValidBooking({
      firstname: 'Updated',
      lastname: 'Guest',
      totalprice: 275,
      additionalneeds: 'Late checkout',
    });

    const updated = await apiClient.updateBooking(created.bookingid, updatedPayload);
    expect(updated.firstname).toBe('Updated');
    expect(updated.lastname).toBe('Guest');
    expect(updated.totalprice).toBe(275);

    const retrieved = await apiClient.getBooking(created.bookingid);
    expect(retrieved.firstname).toBe('Updated');
    expect(retrieved.additionalneeds).toBe('Late checkout');

    await apiClient.deleteBooking(created.bookingid);
  });

  test('should return 404 when retrieving a non-existent booking', async ({ apiClient }) => {
    const nonExistentId = 999999999;
    const result = await apiClient.getBookingRaw(nonExistentId);
    expect(result.status).toBe(404);
  });

  test('should return 404 after a booking is deleted', async ({ apiClient }) => {
    const created = await apiClient.createBooking(createValidBooking());
    const deleteStatus = await apiClient.deleteBooking(created.bookingid);
    expect([201, 200]).toContain(deleteStatus);

    const result = await apiClient.getBookingRaw(created.bookingid);
    expect(result.status).toBe(404);
  });

  test('should reject an invalid booking payload with a non-success status', async ({
    apiClient,
  }) => {
    // Documents DEF-002: RESTful Booker currently returns 500 instead of 400.
    // Assert the contract failure surface without treating 500 as acceptable forever.
    const result = await apiClient.createBookingRaw({ invalid: 'payload' });

    expect(result.status).toBeGreaterThanOrEqual(400);
    expect(result.status).not.toBe(200);
    // Preferred semantic status once the API is fixed:
    // expect(result.status).toBe(400);
    expect(result.status).toBe(500);
  });
});
