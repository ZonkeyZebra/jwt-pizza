import { test, expect } from 'playwright-test-coverage';
import { Page } from '@playwright/test';

async function initRegisterMock(page: Page) {
    await page.route('**/api/auth', async (route) => {
        const request = route.request();

        // Only handle register POST
        if (request.method() === 'POST') {
            const body = JSON.parse(request.postData() || '{}');

            const mockResponse = {
                user: {
                    id: 2,
                    name: body.name,
                    email: body.email,
                    roles: [{ role: 'diner' }],
                },
                token: 'tttttt',
            };

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockResponse),
            });
        }

        // let other requests continue
        return route.continue();
    });
}


test('updateUser', async ({ page }) => {
    await initRegisterMock(page);

    const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('textbox', { name: 'Full name' }).fill('pizza diner');
    await page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill('diner');
    await page.getByRole('button', { name: 'Register' }).click();

    await page.getByRole('link', { name: 'pd' }).click();

    await expect(page.getByRole('main')).toContainText('pizza diner');

    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.locator('h3')).toContainText('Edit user');
    await page.getByRole('button', { name: 'Update' }).click();

    await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

    await expect(page.getByRole('main')).toContainText('pizza diner');
});