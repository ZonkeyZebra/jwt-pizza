import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

test('get to login', async ({ page }) => {
  await page.goto('http://localhost:5173/');
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

test('register', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('newTest');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('new@test.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('testing');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.locator('#navbar-dark')).toMatchAriaSnapshot(`
    - link "Order":
      - /url: /menu
    - link "Franchise":
      - /url: /franchise-dashboard
    - link "Login":
      - /url: /login
    - link "Register":
      - /url: /register
    `);
});

test('login as admin', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('list')).toMatchAriaSnapshot(`
    - list:
      - listitem:
        - link "home":
          - /url: /
          - img
          - text: ""
      - listitem:
        - img
        - link "admin-dashboard":
          - /url: /admin-dashboard
    `);
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Franchises" [level=3]
    - table:
      - rowgroup:
        - row "Franchise Franchisee Store Revenue Action":
          - columnheader "Franchise"
          - columnheader "Franchisee"
          - columnheader "Store"
          - columnheader "Revenue"
          - columnheader "Action"
      - rowgroup:
        - row "02ybpk1lbr e37ba4kk6c Close":
          - cell "02ybpk1lbr"
          - cell "e37ba4kk6c"
          - cell "Close":
            - button "Close":
              - img
              - text: ""
        - row "kyeujvdtwt 0 ₿ Close":
          - cell "kyeujvdtwt"
          - cell "0 ₿"
          - cell "Close":
            - button "Close":
              - img
              - text: ""
      - rowgroup:
        - row "05bsr7pbga l84qddv83p Close":
          - cell "05bsr7pbga"
          - cell "l84qddv83p"
          - cell "Close":
            - button "Close":
              - img
              - text: ""
      - rowgroup:
        - row "16m6wd0hsx luuq4z1uh0 Close":
          - cell "16m6wd0hsx"
          - cell "luuq4z1uh0"
          - cell "Close":
            - button "Close":
              - img
              - text: ""
        - row "6d8kmy4zoa 0 ₿ Close":
          - cell "6d8kmy4zoa"
          - cell "0 ₿"
          - cell "Close":
            - button "Close":
              - img
              - text: ""
      - rowgroup:
        - row "Submit « »":
          - cell "Submit":
            - textbox "Filter franchises"
            - button "Submit"
          - cell "« »":
            - button "«" [disabled]
            - button "»"
    `);
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await expect(page.getByRole('heading')).toContainText('Create franchise');
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - text: Want to create franchise?
    - textbox "franchise name"
    - img
    - textbox "franchisee admin email"
    - img
    - button "Create"
    - button "Cancel"
    `);
  await page.getByRole('link', { name: 'Logout' }).click();
});