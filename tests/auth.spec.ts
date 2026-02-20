import { test, expect } from 'playwright-test-coverage';
import { setupAdminMocks, setupBasicDinerMocks } from './testHelpers';

test('home page', async ({ page }) => {
  await page.goto('/');
  expect(await page.title()).toBe('JWT Pizza');
});

test('get to login', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page.getByText('Welcome back')).toBeVisible();
  await expect(page.getByRole('heading')).toContainText('Welcome back');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - text: Email address
    - textbox "Email address"
    - img
    - text: Password
    - textbox "Password"
    - button:
      - img
    - img
    - button "Login"
    - text: Are you new? Register instead.
    `);
});

test('login as admin', async ({ page }) => {
  await setupAdminMocks(page);
  await page.goto('/');

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('list')).toContainText('admin-dashboard');
});
