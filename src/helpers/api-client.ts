import type { APIRequestContext } from '@playwright/test';
import type { BookingPayload } from '../types';

export interface AuthTokenResponse {
  token: string;
}

export interface BookingResponse {
  bookingid: number;
  booking: BookingPayload;
}

export class RestfulBookerClient {
  readonly request: APIRequestContext;
  readonly baseURL: string;

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL = baseURL.replace(/\/$/, '');
  }

  async createBooking(payload: BookingPayload): Promise<BookingResponse> {
    const response = await this.request.post(`${this.baseURL}/booking`, {
      data: payload,
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok()) {
      throw new Error(`Create booking failed: ${response.status()} ${await response.text()}`);
    }

    return (await response.json()) as BookingResponse;
  }

  async getBooking(id: number): Promise<BookingPayload> {
    const response = await this.request.get(`${this.baseURL}/booking/${id}`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok()) {
      throw new Error(`Get booking failed: ${response.status()} ${await response.text()}`);
    }

    return (await response.json()) as BookingPayload;
  }

  async deleteBooking(id: number): Promise<number> {
    const token = await this.authenticate();
    const response = await this.request.delete(`${this.baseURL}/booking/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${token}`,
      },
    });

    return response.status();
  }

  async authenticate(username = 'admin', password = 'password123'): Promise<string> {
    const response = await this.request.post(`${this.baseURL}/auth`, {
      data: { username, password },
      headers: { 'Content-Type': 'application/json' },
    });

    const body = (await response.json()) as AuthTokenResponse | { reason: string };

    if (!response.ok() || !('token' in body)) {
      throw new Error(`Authentication failed: ${response.status()} ${JSON.stringify(body)}`);
    }

    return body.token;
  }
}
