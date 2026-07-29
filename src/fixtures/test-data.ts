import type { UserCredentials, OrderDetails, BookingPayload } from '../types';

export const testUsers = {
  valid: {
    username: process.env.DEMOBLAZE_USERNAME || '',
    password: process.env.DEMOBLAZE_PASSWORD || '',
  },
  invalid: {
    username: 'nonexistent_user_12345',
    password: 'wrong_password',
  },
  empty: {
    username: '',
    password: '',
  },
} satisfies Record<string, UserCredentials>;

export const orderDetails: OrderDetails = {
  name: 'QA Automation',
  country: 'Testland',
  city: 'Testville',
  card: '4111111111111111',
  month: '12',
  year: '2026',
};

export function assertCredentials(): UserCredentials {
  const username = process.env.DEMOBLAZE_USERNAME;
  const password = process.env.DEMOBLAZE_PASSWORD;

  if (!username || !password) {
    throw new Error('DEMOBLAZE_USERNAME and DEMOBLAZE_PASSWORD must be set. See .env.example');
  }

  return { username, password };
}

export function createValidBooking(overrides: Partial<BookingPayload> = {}): BookingPayload {
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
    ...overrides,
  };
}
