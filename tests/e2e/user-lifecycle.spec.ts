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

test.describe('User Lifecycle - CRUD E2E', () => {
  let userId: string;

  test('Step 1: Create a new user', async ({ request }) => {
    const api = new ApiClient(request);
    const payload = {
      name: 'E2E Lifecycle User',
      email: 'lifecycle@example.com',
      role: 'admin',
    };

    const response = await api.post<UserRecord>('records', payload);

    validateStatus(response, 201);
    validateResponseTime(response, 5000);
    validateSchema(response.body, {
      id: 'string',
      name: 'string',
      email: 'string',
      createdAt: 'string',
    });
    validateFieldValue(response.body, 'name', 'E2E Lifecycle User');
    validateFieldValue(response.body, 'email', 'lifecycle@example.com');
    validateFieldValue(response.body, 'role', 'admin');

    userId = response.body.id;
    expect(userId).toBeTruthy();
  });

  test('Step 2: Update the user', async ({ request }) => {
    const api = new ApiClient(request);
    const payload = {
      name: 'E2E Updated User',
      role: 'superadmin',
    };

    const response = await api.put<UserRecord>(`records/${userId}`, payload);

    validateStatus(response, 200);
    validateFieldValue(response.body, 'name', 'E2E Updated User');
    validateFieldValue(response.body, 'role', 'superadmin');
  });

  test('Step 3: Delete the user', async ({ request }) => {
    const api = new ApiClient(request);
    const response = await api.delete(`records/${userId}`);
    validateStatus(response, 204);
  });

  test('Step 4: Verify user is deleted', async ({ request }) => {
    const api = new ApiClient(request);
    const response = await api.get(`records/${userId}`);
    validateStatus(response, 404);
  });
});
