import { Page } from '@playwright/test';
import { test, expect } from 'playwright-test-coverage';
import { User, Role } from '../src/service/pizzaService';

async function initWithAdmin(page: Page) {
  let loggedInUser: User | undefined;

  const adminUser: User = {
    id: '1',
    name: 'Admin User',
    email: 'a@jwt.com',
    password: 'admin',
    roles: [{ role: Role.Admin }],
  };

  await page.route('*/**/api/auth', async (route) => {
    const { email, password } = route.request().postDataJSON();
    if (email !== adminUser.email || password !== adminUser.password) {
      return route.fulfill({ status: 401 });
    }
    loggedInUser = adminUser;
    await route.fulfill({ json: { user: adminUser, token: 'admin-token' } });
  });

  await page.route('*/**/api/user/me', async (route) => {
    await route.fulfill({ json: loggedInUser });
  });

  await page.route('*/**/api/franchise', async (route) => {
    await route.fulfill({ json: { franchises: [] } });
  });

  await page.goto('/');
}

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

// test('register', async ({ page }) => {
//   await page.goto('/');
//   await page.getByRole('link', { name: 'Register' }).click();
//   await page.getByRole('textbox', { name: 'Full name' }).click();
//   await page.getByRole('textbox', { name: 'Full name' }).fill('newTest');
//   await page.getByRole('textbox', { name: 'Email address' }).click();
//   await page.getByRole('textbox', { name: 'Email address' }).fill('new@test.com');
//   await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
//   await page.getByRole('textbox', { name: 'Password' }).fill('testing');
//   await page.getByRole('button', { name: 'Register' }).click();
//   await page.getByRole('link', { name: 'Logout' }).click();
//   await expect(page.locator('#navbar-dark')).toMatchAriaSnapshot(`
//     - link "Order":
//       - /url: /menu
//     - link "Franchise":
//       - /url: /franchise-dashboard
//     - link "Login":
//       - /url: /login
//     - link "Register":
//       - /url: /register
//     `);
// });

test('login as admin', async ({ page }) => {
  await initWithAdmin(page);

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
});
