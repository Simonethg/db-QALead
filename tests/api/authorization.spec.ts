import { test, expect } from '../../src/fixtures/pages';
import { createValidBooking } from '../../src/fixtures/test-data';

test.describe('RESTful Booker API — authorization', () => {
  test('should reject an unauthenticated full update with 403', async ({ apiClient }) => {
    const created = await apiClient.createBooking(createValidBooking());

    try {
      const result = await apiClient.updateBookingUnauthenticated(
        created.bookingid,
        createValidBooking({ firstname: 'Unauthorized' })
      );

      expect(result.status).toBe(403);
    } finally {
      await apiClient.deleteBooking(created.bookingid);
    }
  });

  test('should reject an unauthenticated delete with 403', async ({ apiClient }) => {
    const created = await apiClient.createBooking(createValidBooking());

    try {
      const result = await apiClient.deleteBookingUnauthenticated(created.bookingid);
      expect(result.status).toBe(403);

      // Booking must still exist when delete was rejected.
      const retrieved = await apiClient.getBooking(created.bookingid);
      expect(retrieved.firstname).toBe('QA');
    } finally {
      await apiClient.deleteBooking(created.bookingid);
    }
  });

  test('should update a booking using HTTP Basic authentication', async ({ apiClient }) => {
    const created = await apiClient.createBooking(createValidBooking());
    const payload = createValidBooking({
      firstname: 'BasicAuth',
      lastname: 'Guest',
      totalprice: 220,
    });

    try {
      const updated = await apiClient.updateBookingWithBasicAuth(created.bookingid, payload);
      expect(updated.firstname).toBe('BasicAuth');
      expect(updated.totalprice).toBe(220);

      const retrieved = await apiClient.getBooking(created.bookingid);
      expect(retrieved.lastname).toBe('Guest');
    } finally {
      await apiClient.deleteBooking(created.bookingid);
    }
  });
});
