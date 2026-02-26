import { expect } from '@playwright/test';
import { ApiResponse } from './api-client';

/**
 * Assert HTTP status code matches expected.
 */
export function validateStatus(response: ApiResponse, expected: number): void {
  expect(response.status, `Expected status ${expected} but got ${response.status}`).toBe(expected);
}

/**
 * Assert response body contains all required fields with correct types.
 * @param body - The response body object
 * @param schema - Map of field names to expected types (e.g. { id: 'string', name: 'string' })
 */
export function validateSchema(body: unknown, schema: Record<string, string>): void {
  expect(body).toBeTruthy();
  const obj = body as Record<string, unknown>;
  for (const [field, expectedType] of Object.entries(schema)) {
    expect(obj, `Missing field: ${field}`).toHaveProperty(field);
    expect(typeof obj[field], `Field "${field}" expected type "${expectedType}" but got "${typeof obj[field]}"`).toBe(
      expectedType
    );
  }
}

/**
 * Assert a specific field value using dot-notation path.
 * e.g. validateFieldValue(body, 'data.id', 'rec_123')
 */
export function validateFieldValue(body: unknown, path: string, expected: unknown): void {
  const value = getNestedValue(body, path);
  expect(value, `Field "${path}" expected "${expected}" but got "${value}"`).toEqual(expected);
}

/**
 * Assert response time is within acceptable threshold.
 */
export function validateResponseTime(response: ApiResponse, maxMs: number): void {
  expect(
    response.responseTimeMs,
    `Response time ${response.responseTimeMs}ms exceeds max ${maxMs}ms`
  ).toBeLessThanOrEqual(maxMs);
}

/**
 * Assert that an array field has a specific length or is non-empty.
 */
export function validateArrayField(body: unknown, path: string, options?: { minLength?: number; maxLength?: number }): void {
  const value = getNestedValue(body, path);
  expect(Array.isArray(value), `Field "${path}" is not an array`).toBe(true);
  const arr = value as unknown[];
  if (options?.minLength !== undefined) {
    expect(arr.length, `Array "${path}" length ${arr.length} < min ${options.minLength}`).toBeGreaterThanOrEqual(
      options.minLength
    );
  }
  if (options?.maxLength !== undefined) {
    expect(arr.length, `Array "${path}" length ${arr.length} > max ${options.maxLength}`).toBeLessThanOrEqual(
      options.maxLength
    );
  }
}

/**
 * Traverse an object using dot-notation path.
 */
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current === null || current === undefined) return undefined;
    return (current as Record<string, unknown>)[key];
  }, obj);
}
