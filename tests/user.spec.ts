import { test, expect } from 'playwright-test-coverage';
import { setupUserUpdateMocks, setupUserListMocks, setupBasicDinerMocks } from './testHelpers';
import { mock } from 'node:test';

test('updateUser', async ({ page }) => {
    const { storedUser } = await setupUserUpdateMocks(page);

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
    const mockState = await setupUserListMocks(page);

    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('textbox', { name: 'Full name' }).fill('pizza admin');
    await page.getByRole('textbox', { name: 'Email address' }).fill('e@email.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('awdmin');
    await page.getByRole('button', { name: 'Register' }).click();

    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('button', { name: 'List/Delete Users' }).click();

    await expect(page.locator('#hs-jwt-modal')).toContainText('Alice Admin');
});

test('delete user', async ({ page }) => {
    const mockState = await setupUserListMocks(page);
    const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('textbox', { name: 'Full name' }).fill('pizza admin');
    await page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill('awdmin');
    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('button', { name: 'List/Delete Users' }).click();
    await expect(page.locator('#hs-jwt-modal')).toContainText('Alice Admin');
    await expect(page.locator('tbody')).toContainText('Bob Baker');
    await expect(page.locator('tbody')).toContainText('Carol Cook');
    await page.getByRole('row', { name: 'Bob Baker bob@jwt.com diner' }).getByRole('button').click();
    await expect(page.locator('tbody')).not.toContainText('Bob Baker');
});