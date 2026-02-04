import { test, expect } from 'playwright-test-coverage';
import { Page } from '@playwright/test';

async function gotoHome(page: Page) {
  await page.goto('/');
}

async function login(page: Page, email: string, password: string) {
  await gotoHome(page);
  await page.getByRole('link', { name: 'Login' }).click();

  await expect(
    page.getByRole('textbox', { name: 'Email address' })
  ).toBeVisible();

  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  // 🔑 this is what proves login succeeded
  await expect(
    page.getByRole('link', { name: 'Logout' })
  ).toBeVisible({ timeout: 10_000 });
}


test('home page', async ({ page }) => {
  await gotoHome(page);
  await expect(page).toHaveTitle('JWT Pizza');
});


test('get to login', async ({ page }) => {
  await gotoHome(page);
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page.getByRole('heading')).toHaveText(/Welcome back/i);
});


test('register', async ({ page }) => {
  await gotoHome(page);
  await page.getByRole('link', { name: 'Register' }).click();

  await page.getByRole('textbox', { name: 'Full name' }).fill('newTest');
  await page.getByRole('textbox', { name: 'Email address' }).fill(
    `new${Date.now()}@test.com`
  );
  await page.getByRole('textbox', { name: 'Password' }).fill('testing');

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(
    page.getByRole('link', { name: 'Logout' })
  ).toBeVisible();

  await page.getByRole('link', { name: 'Logout' }).click();

  await expect(
    page.getByRole('link', { name: 'Login' })
  ).toBeVisible();
});


test('login as admin', async ({ page }) => {
  await login(page, 'a@jwt.com', 'admin');

  // 🔥 this is the line that was failing
  await expect(
    page.getByRole('link', { name: 'Admin' })
  ).toBeVisible({ timeout: 10_000 });

  await page.getByRole('link', { name: 'Admin' }).click();

  // Assert navigation succeeded
  await expect(
    page.getByRole('heading', { name: 'Franchises' })
  ).toBeVisible();

  // Assert table exists (NOT content)
  const table = page.getByRole('table');
  await expect(table).toBeVisible();

  // Open create dialog
  await page.getByRole('button', { name: 'Add Franchise' }).click();

  await expect(
    page.getByRole('heading', { name: /Create franchise/i })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Cancel' }).click();

  await page.getByRole('link', { name: 'Logout' }).click();
});
