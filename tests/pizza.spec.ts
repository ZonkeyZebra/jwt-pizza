import { Page } from '@playwright/test';
import { test, expect } from 'playwright-test-coverage';
import { User, Role } from '../src/service/pizzaService';

async function basicInit(page: Page) {
    let loggedInUser: User | undefined;
    const validUsers: Record<string, User> = { 'd@jwt.com': { id: '3', name: 'Kai Chen', email: 'd@jwt.com', password: 'a', roles: [{ role: Role.Diner }] } };

    // Authorize login for the given user
    // await page.route('*/**/api/auth', async (route) => {
    //     const loginReq = route.request().postDataJSON();
    //     const user = validUsers[loginReq.email];
    //     if (!user || user.password !== loginReq.password) {
    //         await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
    //         return;
    //     }
    //     loggedInUser = validUsers[loginReq.email];
    //     const loginRes = {
    //         user: loggedInUser,
    //         token: 'abcdef',
    //     };
    //     expect(route.request().method()).toBe('PUT');
    //     await route.fulfill({ json: loginRes });
    // });
    // Authorize login + logout
    await page.route('*/**/api/auth', async (route) => {
        const method = route.request().method();

        // -----------------
        // LOGIN
        // -----------------
        if (method === 'PUT') {
            const loginReq = route.request().postDataJSON();
            const user = validUsers[loginReq.email];

            if (!user || user.password !== loginReq.password) {
                return route.fulfill({
                    status: 401,
                    json: { error: 'Unauthorized' },
                });
            }

            loggedInUser = user;

            const loginRes = {
                user: loggedInUser,
                token: 'abcdef',
            };

            return route.fulfill({ json: loginRes });
        }

        // -----------------
        // LOGOUT
        // -----------------
        if (method === 'DELETE') {
            loggedInUser = undefined;

            return route.fulfill({
                status: 200,
                json: { message: 'logged out' },
            });
        }

        return route.fulfill({ status: 404 });
    });


    // Return the currently logged in user
    await page.route('*/**/api/user/me', async (route) => {
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: loggedInUser });
    });

    // A standard menu
    await page.route('*/**/api/order/menu', async (route) => {
        const menuRes = [
            {
                id: 1,
                title: 'Veggie',
                image: 'pizza1.png',
                price: 0.0038,
                description: 'A garden of delight',
            },
            {
                id: 2,
                title: 'Pepperoni',
                image: 'pizza2.png',
                price: 0.0042,
                description: 'Spicy treat',
            },
        ];
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: menuRes });
    });

    // Standard franchises and stores
    await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
        const franchiseRes = {
            franchises: [
                {
                    id: 2,
                    name: 'LotaPizza',
                    stores: [
                        { id: 4, name: 'Lehi' },
                        { id: 5, name: 'Springville' },
                        { id: 6, name: 'American Fork' },
                    ],
                },
                { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
                { id: 4, name: 'topSpot', stores: [] },
            ],
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: franchiseRes });
    });

    // Order a pizza.
    await page.route('*/**/api/order', async (route) => {
        const orderReq = route.request().postDataJSON();
        const orderRes = {
            order: { ...orderReq, id: 23 },
            jwt: 'eyJpYXQ',
        };
        expect(route.request().method()).toBe('POST');
        await route.fulfill({ json: orderRes });
    });

    await page.goto('/');
}

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

async function initFranchisee(page: Page) {
    let loggedInUser: User | undefined;

    const user: User = {
        id: '1',
        name: 'Franchisee',
        email: 'f@jwt.com',
        password: 'franchisee',
        roles: [{ role: Role.Admin }],
    };

    const franchises = [
        {
            id: 2,
            name: 'LotaPizza',
            admins: [{ id: 1, name: 'Franchisee', email: 'f@jwt.com' }],
            stores: [
                { id: 4, name: 'Lehi' },
                { id: 5, name: 'Springville' },
                { id: 6, name: 'American Fork' },
            ],
        },
        {
            id: 3,
            name: 'PizzaCorp',
            admins: [],
            stores: [{ id: 7, name: 'Spanish Fork' }],
        },
        {
            id: 4,
            name: 'topSpot',
            admins: [],
            stores: [],
        },
    ];

    let nextStoreId = 100;
    -
        await page.route('*/**/api/auth', async (route) => {
            const { email, password } = route.request().postDataJSON();

            if (email !== user.email || password !== user.password) {
                return route.fulfill({ status: 401 });
            }

            loggedInUser = user;

            await route.fulfill({
                json: { user, token: 'admin-token' },
            });
        });

    await page.route('*/**/api/user/me', async (route) => {
        await route.fulfill({ json: loggedInUser });
    });

    await page.route(/\/api\/franchise.*/, async (route) => {
        const method = route.request().method();
        const url = route.request().url();

        // get all franchises
        if (method === 'GET' && /\/api\/franchise(\?.*)?$/.test(url)) {
            return route.fulfill({
                json: { franchises, more: false },
            });
        }

        // get user franchise
        if (method === 'GET' && /\/api\/franchise\/\d+$/.test(url)) {
            const match = url.match(/franchise\/(\d+)/);
            const userId = match?.[1];

            if (!loggedInUser || loggedInUser.id !== userId) {
                return route.fulfill({ json: [] });
            }

            return route.fulfill({ json: franchises });
        }

        // create store
        if (method === 'POST' && /\/api\/franchise\/\d+\/store$/.test(url)) {
            const body = route.request().postDataJSON();

            const match = url.match(/franchise\/(\d+)/);
            const franchiseId = Number(match?.[1]);

            const franchise = franchises.find(f => f.id === franchiseId);

            if (!franchise) {
                return route.fulfill({ status: 404 });
            }

            const isOwner = franchise.admins.some(a => String(a.id) === loggedInUser?.id);

            const isAdmin =
                loggedInUser?.roles?.some(r => r.role === Role.Admin);

            if (!isOwner && !isAdmin) {
                return route.fulfill({ status: 403 });
            }

            const newStore = {
                id: nextStoreId++,
                name: body.name,
                totalRevenue: 0,
            };

            franchise.stores.push(newStore);

            return route.fulfill({ json: newStore });
        }

        // delete store
        if (method === 'DELETE' && /\/api\/franchise\/\d+\/store\/\d+$/.test(url)) {
            const match = url.match(/franchise\/(\d+)\/store\/(\d+)/);

            const franchiseId = Number(match?.[1]);
            const storeId = Number(match?.[2]);

            const franchise = franchises.find(f => f.id === franchiseId);

            if (!franchise) {
                return route.fulfill({ status: 404 });
            }

            const isOwner =
                franchise.admins.some(a => String(a.id) === loggedInUser?.id);

            const isAdmin =
                loggedInUser?.roles?.some(r => r.role === Role.Admin);

            if (!isOwner && !isAdmin) {
                return route.fulfill({ status: 403 });
            }

            franchise.stores = franchise.stores.filter(s => s.id !== storeId);

            return route.fulfill({ json: { message: 'store deleted' } });
        }

        return route.fulfill({ status: 404 });
    });

    await page.goto('/');
}


test('login', async ({ page }) => {
    await basicInit(page);
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();
});

test('purchase with login', async ({ page }) => {
    await basicInit(page);

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
    await initWithAdmin(page);
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
    await initFranchisee(page);
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
    await basicInit(page);
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
    await initFranchisee(page);
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Admin' }).click();
});