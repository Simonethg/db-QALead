import type { UserCredentials, OrderDetails } from '../types';

export const testUsers = {
  valid: {
    username: process.env.DEMOBLAZE_USERNAME || '',
    password: process.env.DEMOBLAZE_PASSWORD || '',
  },
  invalid: {
    username: 'nonexistent_user_12345',
    password: 'wrong_password',
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
