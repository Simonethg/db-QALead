import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { BookingPayload } from '../types';

export interface AuthTokenResponse {
  token: string;
}

export interface BookingResponse {
  bookingid: number;
  booking: BookingPayload;
}

export interface BookingIdEntry {
  bookingid: number;
}

export interface BookingQueryFilters {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
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

  async ping(): Promise<RawApiResult> {
    const response = await this.request.get(`${this.baseURL}/ping`);
    return this.toRawResult(response);
  }

  async getBookingIds(filters: BookingQueryFilters = {}): Promise<BookingIdEntry[]> {
    const params: Record<string, string> = {};
    if (filters.firstname) params.firstname = filters.firstname;
    if (filters.lastname) params.lastname = filters.lastname;
    if (filters.checkin) params.checkin = filters.checkin;
    if (filters.checkout) params.checkout = filters.checkout;

    const response = await this.request.get(`${this.baseURL}/booking`, {
      params,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok()) {
      throw new Error(`Get booking IDs failed: ${response.status()} ${await response.text()}`);
    }

    return (await response.json()) as BookingIdEntry[];
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

  async getBookingRaw(id: number, accept = 'application/json'): Promise<RawApiResult> {
    const response = await this.request.get(`${this.baseURL}/booking/${id}`, {
      headers: { Accept: accept },
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

  async updateBookingWithBasicAuth(
    id: number,
    payload: BookingPayload,
    username = 'admin',
    password = 'password123'
  ): Promise<BookingPayload> {
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    const response = await this.request.put(`${this.baseURL}/booking/${id}`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${credentials}`,
      },
    });

    if (!response.ok()) {
      throw new Error(
        `Update booking with basic auth failed: ${response.status()} ${await response.text()}`
      );
    }

    return (await response.json()) as BookingPayload;
  }

  async updateBookingUnauthenticated(id: number, payload: BookingPayload): Promise<RawApiResult> {
    const response = await this.request.put(`${this.baseURL}/booking/${id}`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    return this.toRawResult(response);
  }

  async patchBooking(id: number, partial: Partial<BookingPayload>): Promise<BookingPayload> {
    const token = await this.authenticate();
    const response = await this.request.patch(`${this.baseURL}/booking/${id}`, {
      data: partial,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${token}`,
      },
    });

    if (!response.ok()) {
      throw new Error(`Patch booking failed: ${response.status()} ${await response.text()}`);
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

  async deleteBookingUnauthenticated(id: number): Promise<RawApiResult> {
    const response = await this.request.delete(`${this.baseURL}/booking/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    return this.toRawResult(response);
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
