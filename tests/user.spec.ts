import { test, expect } from 'playwright-test-coverage';
import { Page } from '@playwright/test';

async function initForUpdateUser(page: Page) {
    let storedUser: any;
    const token = 'tttttt';

    // REGISTER + LOGIN
    await page.route('**/api/auth', async (route) => {
        const request = route.request();
        const body = JSON.parse(request.postData() || '{}');

        // REGISTER
        if (request.method() === 'POST') {
            storedUser = {
                id: 2,
                name: body.name,
                email: body.email,
                roles: [{ role: 'diner' }],
            };

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    user: storedUser,
                    token,
                }),
            });
        }

        // LOGIN
        if (request.method() === 'PUT') {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    user: storedUser,
                    token,
                }),
            });
        }

        return route.continue();
    });

    // UPDATE USER
    await page.route(/\/api\/user\/\d+$/, async (route) => {
        const request = route.request();

        if (request.method() === 'PUT') {
            const body = JSON.parse(request.postData() || '{}');

            storedUser = {
                ...storedUser,
                name: body.name,
                email: body.email,
            };

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    user: storedUser,
                    token,
                }),
            });
        }

        return route.continue();
    });
}

async function initForListAndDeleteUsers(page: Page) {
    let storedUser: any;
    const token = 'tttttt';

    // REGISTER + LOGIN
    await page.route('**/api/auth', async (route) => {
        const request = route.request();
        const body = JSON.parse(request.postData() || '{}');

        // REGISTER
        if (request.method() === 'POST') {
            storedUser = {
                id: 2,
                name: body.name,
                email: body.email,
                roles: [{ role: 'admin' }],
            };

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    user: storedUser,
                    token,
                }),
            });
        }

        // LOGIN
        if (request.method() === 'PUT') {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    user: storedUser,
                    token,
                }),
            });
        }

        return route.continue();
    });

    // UPDATE USER
    await page.route(/\/api\/user\/\d+$/, async (route) => {
        const request = route.request();

        if (request.method() === 'PUT') {
            const body = JSON.parse(request.postData() || '{}');

            storedUser = {
                ...storedUser,
                name: body.name,
                email: body.email,
            };

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    user: storedUser,
                    token,
                }),
            });
        }

        return route.continue();
    });
}

test('updateUser', async ({ page }) => {
    // await initRegisterMock(page);
    await initForUpdateUser(page);

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
    await page.getByRole('textbox').first().fill('pizza dinerx');
    await page.getByRole('button', { name: 'Update' }).click();

    await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

    await expect(page.getByRole('main')).toContainText('pizza dinerx');

    await page.getByRole('link', { name: 'Logout' }).click();
    await page.getByRole('link', { name: 'Login' }).click();

    await page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill('diner');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('link', { name: 'pd' }).click();

    await expect(page.getByRole('main')).toContainText('pizza dinerx');
});

test('list users', async ({ page }) => {
    await initForListAndDeleteUsers(page);
    const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('textbox', { name: 'Full name' }).fill('pizza admin');
    await page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill('awdmin');
    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByRole('link', { name: 'Admin' }).click();
});