import { test, expect } from '../../src/fixtures/pages';
import type { BookingPayload } from '../../src/types';

function createValidBooking(): BookingPayload {
  return {
    firstname: 'QA',
    lastname: 'Automation',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-08-01',
      checkout: '2026-08-05',
    },
    additionalneeds: 'Breakfast',
  };
}

test.describe('RESTful Booker API', () => {
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

  test('should return 404 when retrieving a non-existent booking', async ({ apiClient }) => {
    // Using a large, unlikely ID to simulate a missing resource.
    const nonExistentId = 999999999;

    await expect(apiClient.getBooking(nonExistentId)).rejects.toThrow('404');
  });
});
