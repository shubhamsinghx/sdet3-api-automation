import { test, expect } from '@playwright/test';
import { ApiClient } from '../../framework/api-client';
import { validateStatus, validateSchema, validateFieldValue, validateResponseTime } from '../../framework/validators';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
}

let api: ApiClient;
const createdUserIds: string[] = [];

test.beforeEach(async ({ request }) => {
  api = new ApiClient(request);
});

test.describe('POST /records - Create User', () => {
  test('TC-02: Should create a new user with all fields', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'tester',
    };

    const response = await api.post<UserRecord>('records', payload);

    validateStatus(response, 201);
    validateResponseTime(response, 5000);
    validateSchema(response.body, {
      id: 'string',
      name: 'string',
      email: 'string',
    });
    validateFieldValue(response.body, 'name', 'John Doe');
    validateFieldValue(response.body, 'email', 'john@example.com');
    validateFieldValue(response.body, 'role', 'tester');

    expect(response.body.id).toBeTruthy();
    expect(response.body.createdAt).toBeTruthy();

    createdUserIds.push(response.body.id);
  });

  test('TC-02a: Should create a user with minimal required fields', async () => {
    const payload = {
      name: 'Minimal User',
      email: 'minimal@example.com',
    };

    const response = await api.post<UserRecord>('records', payload);

    validateStatus(response, 201);
    validateFieldValue(response.body, 'name', 'Minimal User');
    validateFieldValue(response.body, 'email', 'minimal@example.com');
    expect(response.body.id).toBeTruthy();

    createdUserIds.push(response.body.id);
  });

  test('TC-02b: Should return unique IDs for each created user', async () => {
    const user1 = await api.post<UserRecord>('records', {
      name: 'User One',
      email: 'user1@example.com',
      role: 'dev',
    });
    const user2 = await api.post<UserRecord>('records', {
      name: 'User Two',
      email: 'user2@example.com',
      role: 'dev',
    });

    expect(user1.body.id).not.toBe(user2.body.id);

    createdUserIds.push(user1.body.id, user2.body.id);
  });
});

test.afterAll(async ({ request }) => {
  // Cleanup: delete all created users
  const cleanupApi = new ApiClient(request);
  for (const id of createdUserIds) {
    await cleanupApi.delete(`records/${id}`);
  }
});
