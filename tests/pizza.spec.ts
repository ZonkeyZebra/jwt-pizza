import { test, expect } from 'playwright-test-coverage';
import { setupBasicDinerMocks, setupAdminMocks, setupFranchiseeMocks } from './testHelpers';

test('login', async ({ page }) => {
    await setupBasicDinerMocks(page);
    await page.goto('/');

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();
});

test('purchase with login', async ({ page }) => {
    await setupBasicDinerMocks(page);
    await page.goto('/');

    // Go to order page
    await page.getByRole('button', { name: 'Order now' }).click();

    // Create order
    await expect(page.locator('h2')).toContainText('Awesome is a click away');
    await page.getByRole('combobox').selectOption('4');
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await expect(page.locator('form')).toContainText('Selected pizzas: 2');
    await page.getByRole('button', { name: 'Checkout' }).click();

    // Login
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('d@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    // Pay
    await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
    await expect(page.locator('tbody')).toContainText('Veggie');
    await expect(page.locator('tbody')).toContainText('Pepperoni');
    await expect(page.locator('tfoot')).toContainText('0.008 ₿');
    await page.getByRole('button', { name: 'Pay now' }).click();

    // Check balance
    await expect(page.getByText('0.008')).toBeVisible();
});

test('visit about page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page.getByRole('main')).toContainText('The secret sauce');
    await expect(page.getByRole('list')).toMatchAriaSnapshot(`
    - list:
      - listitem:
        - link "home":
          - /url: /
          - img
          - text: ""
      - listitem:
        - img
        - link "about":
          - /url: /about
    `);
});

test('not found page', async ({ page }) => {
    await page.goto('/not-found');
    await expect(page.getByRole('heading')).toContainText('Oops');
    await expect(page.getByRole('main')).toContainText('It looks like we have dropped a pizza on the floor. Please try another page.');
});

test('view history page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'History' }).click();
    await expect(page.getByRole('list')).toContainText('history');
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - text: It all started in Mama Ricci's kitchen. She would delight all of the cousins with a hot pie in any style they could think of Milanese, Chicago deep dish, Detroit square pan, Neapolitan, or even fusion flatbread.
    - paragraph: Pizza has a long and rich history that dates back thousands of years. Its origins can be traced back to ancient civilizations such as the Egyptians, Greeks, and Romans. The ancient Egyptians were known to bake flatbreads topped with various ingredients, similar to modern-day pizza. In ancient Greece, they had a dish called "plakous" which consisted of flatbread topped with olive oil, herbs, and cheese.
    - paragraph: However, it was the Romans who truly popularized pizza-like dishes. They would top their flatbreads with various ingredients such as cheese, honey, and bay leaves.
    - paragraph: Fast forward to the 18th century in Naples, Italy, where the modern pizza as we know it today was born. Neapolitan pizza was typically topped with tomatoes, mozzarella cheese, and basil. It quickly became a favorite among the working class due to its affordability and delicious taste. In the late 19th century, pizza made its way to the United States through Italian immigrants.
    - paragraph: It gained popularity in cities like New York and Chicago, where pizzerias started popping up. Today, pizza is enjoyed worldwide and comes in countless variations and flavors. However, the classic Neapolitan pizza is still a favorite among many pizza enthusiasts. This is especially true if it comes from JWT Pizza!
    `);
});

test('admin diner dashboard', async ({ page }) => {
    await setupAdminMocks(page);
    await page.goto('/');

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.waitForLoadState('networkidle');

    await page.getByRole('link', { name: 'Franchise' }).click();
    await expect(page.getByRole('list')).toContainText('franchise-dashboard');
    await expect(page.locator('thead')).toContainText('Franchise Fee');
    await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?');
    await expect(page.getByRole('main')).toContainText('Unleash Your Potential');

    await page.getByRole('link', { name: 'AU' }).click();
    await expect(page.getByRole('list')).toContainText('diner-dashboard');
    await expect(page.getByRole('main')).toContainText('How have you lived this long without having a pizza? Buy one now!');
    await expect(page.getByRole('heading')).toContainText('Your pizza kitchen');
});

test('create store and delete store', async ({ page }) => {
    await setupFranchiseeMocks(page);
    await page.goto('/');

    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await page.getByRole('link', { name: 'login', exact: true }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('main')).toContainText('Everything you need to run an JWT Pizza franchise. Your gateway to success.');
    await page.getByRole('button', { name: 'Create store' }).click();
    await page.getByRole('textbox', { name: 'store name' }).click();
    await page.getByRole('textbox', { name: 'store name' }).fill('newStore');
    await page.getByRole('button', { name: 'Create' }).click();
    await page.getByRole('row', { name: 'Lehi ₿ Close' }).getByRole('button').click();
    await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
    await page.getByRole('button', { name: 'Close' }).click();
});

test('logout', async ({ page }) => {
    await setupBasicDinerMocks(page);
    await page.goto('/');

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login' }).click();
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

test('add or remove franchise', async ({ page }) => {
    await setupFranchiseeMocks(page);
    await page.goto('/');

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Admin' }).click();

    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await page.getByRole('textbox', { name: 'franchise name' }).click();
    await page.getByRole('textbox', { name: 'franchise name' }).fill('new');
    await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
    await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('f@jwt.com');
    await page.getByRole('button', { name: 'Create' }).click();

    await page.locator('tbody:nth-child(4) > .border-neutral-500 > .px-6 > .px-2').click();
    await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
    await page.getByRole('button', { name: 'Close' }).click();
});
