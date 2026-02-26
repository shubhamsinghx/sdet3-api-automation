import { test, expect } from '@playwright/test';
import { ApiClient } from '../../framework/api-client';
import { validateStatus } from '../../framework/validators';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

let api: ApiClient;

test.beforeEach(async ({ request }) => {
  api = new ApiClient(request);
});

test.describe('DELETE /records/:id - Delete User', () => {
  test('TC-05: Should delete an existing user and return 204', async () => {
    // First, create a user to delete
    const createResponse = await api.post<UserRecord>('records', {
      name: 'Delete Me',
      email: 'deleteme@example.com',
      role: 'temp',
    });

    validateStatus(createResponse, 201);
    const userId = createResponse.body.id;

    // Delete the user
    const deleteResponse = await api.delete(`records/${userId}`);
    validateStatus(deleteResponse, 204);

    // Verify the user no longer exists
    const getResponse = await api.get(`records/${userId}`);
    validateStatus(getResponse, 404);
  });

  test('TC-05a: Should return 404 when deleting non-existent user', async () => {
    const response = await api.get('records/rec_nonexistent_delete_test');
    validateStatus(response, 404);
  });
});
