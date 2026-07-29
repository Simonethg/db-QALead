import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { BookingPayload } from '../types';

export interface AuthTokenResponse {
  token: string;
}

export interface BookingResponse {
  bookingid: number;
  booking: BookingPayload;
}

export interface RawApiResult {
  status: number;
  body: string;
  json: unknown;
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

  /**
   * Creates a booking without throwing on non-2xx responses.
   * Useful for negative contract checks and defect documentation.
   */
  async createBookingRaw(payload: unknown): Promise<RawApiResult> {
    const response = await this.request.post(`${this.baseURL}/booking`, {
      data: payload,
      headers: { 'Content-Type': 'application/json' },
    });

    return this.toRawResult(response);
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

  async getBookingRaw(id: number): Promise<RawApiResult> {
    const response = await this.request.get(`${this.baseURL}/booking/${id}`, {
      headers: { Accept: 'application/json' },
    });

    return this.toRawResult(response);
  }

  async updateBooking(id: number, payload: BookingPayload): Promise<BookingPayload> {
    const token = await this.authenticate();
    const response = await this.request.put(`${this.baseURL}/booking/${id}`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${token}`,
      },
    });

    if (!response.ok()) {
      throw new Error(`Update booking failed: ${response.status()} ${await response.text()}`);
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
    const result = await this.authenticateRaw(username, password);

    if (
      result.status < 200 ||
      result.status >= 300 ||
      !result.json ||
      typeof result.json !== 'object'
    ) {
      throw new Error(`Authentication failed: ${result.status} ${result.body}`);
    }

    const body = result.json as AuthTokenResponse | { reason: string };
    if (!('token' in body) || !body.token) {
      throw new Error(`Authentication failed: ${result.status} ${result.body}`);
    }

    return body.token;
  }

  async authenticateRaw(username: string, password: string): Promise<RawApiResult> {
    const response = await this.request.post(`${this.baseURL}/auth`, {
      data: { username, password },
      headers: { 'Content-Type': 'application/json' },
    });

    return this.toRawResult(response);
  }

  private async toRawResult(response: APIResponse): Promise<RawApiResult> {
    const body = await response.text();
    let json: unknown = null;

    if (body) {
      try {
        json = JSON.parse(body);
      } catch {
        json = null;
      }
    }

    return {
      status: response.status(),
      body,
      json,
    };
  }
}
