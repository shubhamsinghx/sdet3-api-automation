import { APIRequestContext } from '@playwright/test';
import { logger } from './logger';

export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
  headers: Record<string, string>;
  responseTimeMs: number;
}

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  async get<T = unknown>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = endpoint + (params ? '?' + new URLSearchParams(params).toString() : '');
    logger.logRequest('GET', url);

    const start = Date.now();
    const response = await this.request.get(url);
    const responseTimeMs = Date.now() - start;

    const status = response.status();
    const body = status === 204 ? ({} as T) : await this.safeParseJson<T>(response);
    const headers = Object.fromEntries(
      Object.entries(response.headers())
    );

    logger.logResponse(status, body, responseTimeMs);
    return { status, body, headers, responseTimeMs };
  }

  async post<T = unknown>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    logger.logRequest('POST', endpoint, data);

    const start = Date.now();
    const response = await this.request.post(endpoint, { data });
    const responseTimeMs = Date.now() - start;

    const status = response.status();
    const body = await this.safeParseJson<T>(response);
    const headers = Object.fromEntries(
      Object.entries(response.headers())
    );

    logger.logResponse(status, body, responseTimeMs);
    return { status, body, headers, responseTimeMs };
  }

  async put<T = unknown>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    logger.logRequest('PUT', endpoint, data);

    const start = Date.now();
    const response = await this.request.put(endpoint, { data });
    const responseTimeMs = Date.now() - start;

    const status = response.status();
    const body = status === 204 ? ({} as T) : await this.safeParseJson<T>(response);
    const headers = Object.fromEntries(
      Object.entries(response.headers())
    );

    logger.logResponse(status, body, responseTimeMs);
    return { status, body, headers, responseTimeMs };
  }

  async delete(endpoint: string): Promise<ApiResponse<Record<string, never>>> {
    logger.logRequest('DELETE', endpoint);

    const start = Date.now();
    const response = await this.request.delete(endpoint);
    const responseTimeMs = Date.now() - start;

    const status = response.status();
    const headers = Object.fromEntries(
      Object.entries(response.headers())
    );

    logger.logResponse(status, {}, responseTimeMs);
    return { status, body: {}, headers, responseTimeMs };
  }

  private async safeParseJson<T>(response: { text: () => Promise<string> }): Promise<T> {
    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch {
      logger.error(`Failed to parse JSON response. Body starts with: ${text.substring(0, 200)}`);
      throw new Error(`Expected JSON response but got: ${text.substring(0, 200)}`);
    }
  }
}
