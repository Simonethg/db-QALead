import { test, expect } from '../../src/fixtures/pages';
import { createValidBooking } from '../../src/fixtures/test-data';

test.describe('RESTful Booker API — booking queries', () => {
  test('should list booking IDs', async ({ apiClient }) => {
    const ids = await apiClient.getBookingIds();

    expect(ids.length).toBeGreaterThan(0);
    expect(ids[0]).toEqual(expect.objectContaining({ bookingid: expect.any(Number) }));
  });

  test('should filter booking IDs by firstname', async ({ apiClient }) => {
    const uniqueFirstName = `FilterQA${Date.now()}`;
    const created = await apiClient.createBooking(
      createValidBooking({ firstname: uniqueFirstName })
    );

    try {
      const matches = await apiClient.getBookingIds({ firstname: uniqueFirstName });

      expect(matches.some((entry) => entry.bookingid === created.bookingid)).toBe(true);
    } finally {
      await apiClient.deleteBooking(created.bookingid);
    }
  });
});
