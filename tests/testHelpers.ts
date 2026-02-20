import { Page, expect } from '@playwright/test';
import { User, Role } from '../src/service/pizzaService';

/**
 * Centralized test helpers to ensure tests run independently and consistently.
 * Each test gets completely isolated mock data and route handlers.
 */

export interface MockState {
    loggedInUser: User | undefined;
}

/**
 * Setup basic auth and menu mocks for a diner user.
 * Automatically clears before and after to ensure isolation.
 */
export async function setupBasicDinerMocks(page: Page): Promise<MockState> {
    const mockState: MockState = {
        loggedInUser: undefined,
    };

    const validUsers: Record<string, User> = {
        'd@jwt.com': {
            id: '3',
            name: 'Kai Chen',
            email: 'd@jwt.com',
            password: 'a',
            roles: [{ role: Role.Diner }],
        },
    };

    // Clear all previous routes to avoid conflicts
    await page.unroute('**/*');

    // Auth handler - login/logout
    await page.route('*/**/api/auth', async (route) => {
        const method = route.request().method();

        if (method === 'PUT') {
            const loginReq = route.request().postDataJSON();
            const user = validUsers[loginReq.email];

            if (!user || user.password !== loginReq.password) {
                return route.fulfill({
                    status: 401,
                    json: { error: 'Unauthorized' },
                });
            }

            mockState.loggedInUser = user;

            const loginRes = {
                user: mockState.loggedInUser,
                token: 'abcdef',
            };

            return route.fulfill({ json: loginRes });
        }

        if (method === 'DELETE') {
            mockState.loggedInUser = undefined;
            return route.fulfill({
                status: 200,
                json: { message: 'logged out' },
            });
        }

        return route.fulfill({ status: 404 });
    });

    // Get current user
    await page.route('*/**/api/user/me', async (route) => {
        if (route.request().method() !== 'GET') {
            return route.abort();
        }
        await route.fulfill({ json: mockState.loggedInUser });
    });

    // Menu
    await page.route('*/**/api/order/menu', async (route) => {
        if (route.request().method() !== 'GET') {
            return route.abort();
        }
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
        await route.fulfill({ json: menuRes });
    });

    // Franchises and stores
    await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
        if (route.request().method() !== 'GET') {
            return route.abort();
        }
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
        await route.fulfill({ json: franchiseRes });
    });

    // Place order
    await page.route('*/**/api/order', async (route) => {
        if (route.request().method() !== 'POST') {
            return route.abort();
        }
        const orderReq = route.request().postDataJSON();
        const orderRes = {
            order: { ...orderReq, id: 23 },
            jwt: 'eyJpYXQ',
        };
        await route.fulfill({ json: orderRes });
    });

    return mockState;
}

/**
 * Setup admin user mocks for franchise/admin tests.
 */
export async function setupAdminMocks(page: Page): Promise<MockState> {
    const mockState: MockState = {
        loggedInUser: undefined,
    };

    const adminUser: User = {
        id: '1',
        name: 'Admin User',
        email: 'a@jwt.com',
        password: 'admin',
        roles: [{ role: Role.Admin }],
    };

    await page.unroute('**/*');

    await page.route('*/**/api/auth', async (route) => {
        const method = route.request().method();

        if (method === 'PUT') {
            const { email, password } = route.request().postDataJSON();
            if (email !== adminUser.email || password !== adminUser.password) {
                return route.fulfill({ status: 401 });
            }
            mockState.loggedInUser = adminUser;
            await route.fulfill({ json: { user: adminUser, token: 'admin-token' } });
        } else if (method === 'DELETE') {
            mockState.loggedInUser = undefined;
            await route.fulfill({ status: 200, json: { message: 'logged out' } });
        } else {
            return route.abort();
        }
    });

    await page.route('*/**/api/user/me', async (route) => {
        if (route.request().method() !== 'GET') {
            return route.abort();
        }
        await route.fulfill({ json: mockState.loggedInUser });
    });

    await page.route('*/**/api/franchise', async (route) => {
        if (route.request().method() !== 'GET') {
            return route.abort();
        }
        await route.fulfill({ json: { franchises: [] } });
    });

    return mockState;
}

/**
 * Setup franchisee/franchise management mocks.
 */
export async function setupFranchiseeMocks(page: Page): Promise<MockState> {
    const mockState: MockState = {
        loggedInUser: undefined,
    };

    const user: User = {
        id: '1',
        name: 'Franchisee',
        email: 'f@jwt.com',
        password: 'franchisee',
        roles: [{ role: Role.Admin }],
    };

    // Use scoped state for this test
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

    await page.unroute('**/*');

    await page.route('*/**/api/auth', async (route) => {
        const method = route.request().method();

        if (method === 'PUT') {
            const { email, password } = route.request().postDataJSON();
            if (email !== user.email || password !== user.password) {
                return route.fulfill({ status: 401 });
            }
            mockState.loggedInUser = user;
            await route.fulfill({ json: { user, token: 'admin-token' } });
        } else if (method === 'DELETE') {
            mockState.loggedInUser = undefined;
            await route.fulfill({ status: 200, json: { message: 'logged out' } });
        } else {
            return route.abort();
        }
    });

    await page.route('*/**/api/user/me', async (route) => {
        if (route.request().method() !== 'GET') {
            return route.abort();
        }
        await route.fulfill({ json: mockState.loggedInUser });
    });

    await page.route(/\/api\/franchise.*/, async (route) => {
        const method = route.request().method();
        const url = route.request().url();

        // Create franchise
        if (method === 'POST' && /\/api\/franchise$/.test(url)) {
            const body = route.request().postDataJSON();
            const newFranchise = {
                id: nextStoreId++,
                name: body.name,
                admins: [
                    {
                        id: 3,
                        name: 'pizza franchisee',
                        email: body.admins?.[0]?.email,
                    },
                ],
                stores: [],
            };
            franchises.push(newFranchise);
            return route.fulfill({ status: 200, json: newFranchise });
        }

        // Delete franchise
        if (method === 'DELETE' && /\/api\/franchise\/\d+$/.test(url)) {
            const match = url.match(/franchise\/(\d+)$/);
            const franchiseId = Number(match?.[1]);
            const franchise = franchises.find((f) => f.id === franchiseId);

            if (!franchise) {
                return route.fulfill({ status: 404 });
            }

            const isOwner = franchise.admins.some((a) => String(a.id) === mockState.loggedInUser?.id);
            const isAdmin = mockState.loggedInUser?.roles?.some((r) => r.role === Role.Admin);

            if (!isOwner && !isAdmin) {
                return route.fulfill({ status: 403 });
            }

            const index = franchises.indexOf(franchise);
            if (index > -1) franchises.splice(index, 1);

            return route.fulfill({ status: 200, json: { message: 'franchise deleted' } });
        }

        // Get all franchises
        if (method === 'GET' && /\/api\/franchise(\?.*)?$/.test(url)) {
            return route.fulfill({ json: { franchises, more: false } });
        }

        // Get user franchise
        if (method === 'GET' && /\/api\/franchise\/\d+$/.test(url)) {
            const match = url.match(/franchise\/(\d+)/);
            const userId = match?.[1];
            if (!mockState.loggedInUser || mockState.loggedInUser.id !== userId) {
                return route.fulfill({ json: [] });
            }
            return route.fulfill({ json: franchises });
        }

        // Create store
        if (method === 'POST' && /\/api\/franchise\/\d+\/store$/.test(url)) {
            const body = route.request().postDataJSON();
            const match = url.match(/franchise\/(\d+)/);
            const franchiseId = Number(match?.[1]);
            const franchise = franchises.find((f) => f.id === franchiseId);

            if (!franchise) {
                return route.fulfill({ status: 404 });
            }

            const isOwner = franchise.admins.some((a) => String(a.id) === mockState.loggedInUser?.id);
            const isAdmin = mockState.loggedInUser?.roles?.some((r) => r.role === Role.Admin);

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

        // Delete store
        if (method === 'DELETE' && /\/api\/franchise\/\d+\/store\/\d+$/.test(url)) {
            const match = url.match(/franchise\/(\d+)\/store\/(\d+)/);
            const franchiseId = Number(match?.[1]);
            const storeId = Number(match?.[2]);

            const franchise = franchises.find((f) => f.id === franchiseId);

            if (!franchise) {
                return route.fulfill({ status: 404 });
            }

            const isOwner = franchise.admins.some((a) => String(a.id) === mockState.loggedInUser?.id);
            const isAdmin = mockState.loggedInUser?.roles?.some((r) => r.role === Role.Admin);

            if (!isOwner && !isAdmin) {
                return route.fulfill({ status: 403 });
            }

            franchise.stores = franchise.stores.filter((s) => s.id !== storeId);
            return route.fulfill({ json: { message: 'store deleted' } });
        }

        return route.fulfill({ status: 404 });
    });

    return mockState;
}

/**
 * Setup user registration/update mocks.
 */
export async function setupUserUpdateMocks(page: Page): Promise<{ storedUser: any }> {
    const state = { storedUser: undefined as any };
    const token = 'tttttt';

    await page.unroute('**/*');

    await page.route('**/api/auth', async (route) => {
        const request = route.request();
        const body = JSON.parse(request.postData() || '{}');

        // Register
        if (request.method() === 'POST') {
            state.storedUser = {
                id: 2,
                name: body.name,
                email: body.email,
                roles: [{ role: 'diner' }],
            };

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    user: state.storedUser,
                    token,
                }),
            });
        }

        // Login
        if (request.method() === 'PUT') {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    user: state.storedUser,
                    token,
                }),
            });
        }

        return route.abort();
    });

    await page.route('**/api/user/me', async (route) => {
        if (route.request().method() !== 'GET') {
            return route.abort();
        }
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(state.storedUser),
        });
    });

    await page.route(/\/api\/user\/\d+$/, async (route) => {
        const request = route.request();

        if (request.method() === 'PUT') {
            const body = JSON.parse(request.postData() || '{}');
            state.storedUser = {
                ...state.storedUser,
                name: body.name,
                email: body.email,
            };

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    user: state.storedUser,
                    token,
                }),
            });
        }

        return route.abort();
    });

    return state;
}

/**
 * Setup user list/delete mocks for admin tests.
 */
export async function setupUserListMocks(page: Page): Promise<MockState> {
    const mockState: MockState = {
        loggedInUser: undefined,
    };

    const token = 'tttttt';

    const users = [
        { id: 1, name: 'Alice Admin', email: 'alice@jwt.com', roles: [{ role: 'admin' }] },
        { id: 3, name: 'Bob Baker', email: 'bob@jwt.com', roles: [{ role: 'diner' }] },
        { id: 4, name: 'Carol Cook', email: 'carol@jwt.com', roles: [{ role: 'franchisee' }] },
    ];

    /* ---------------- AUTH ---------------- */

    await page.route('**/api/auth', async (route) => {
        const request = route.request();

        // Always log in as admin for this test
        mockState.loggedInUser = {
            id: '1',
            name: 'Alice Admin',
            email: 'alice@jwt.com',
            roles: [{ role: Role.Admin }],
        };

        return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                user: mockState.loggedInUser,
                token,
            }),
        });
    });

    /* ---------------- CURRENT USER ---------------- */

    await page.route('**/api/user/me', async (route) => {
        if (!mockState.loggedInUser) {
            return route.fulfill({
                status: 401,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'unauthorized' }),
            });
        }

        return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockState.loggedInUser),
        });
    });

    /* ---------------- USERS (LIST / DELETE / UPDATE) ---------------- */

    await page.route('**/api/user**', async (route) => {
        const request = route.request();
        const method = request.method();
        const url = request.url();

        // LIST USERS
        if (method === 'GET' && url.includes('/api/user?')) {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    users,
                    more: false,
                }),
            });
        }

        // DELETE USER
        if (method === 'DELETE') {
            const match = url.match(/\/api\/user\/(\d+)$/);
            const id = match ? Number(match[1]) : null;

            if (id !== null) {
                const index = users.findIndex((u) => u.id === id);
                if (index !== -1) users.splice(index, 1);
            }

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({}),
            });
        }

        // UPDATE USER
        if (method === 'PUT') {
            const body = JSON.parse(request.postData() || '{}');

            mockState.loggedInUser = {
                ...mockState.loggedInUser,
                name: body.name ?? mockState.loggedInUser?.name,
                email: body.email ?? mockState.loggedInUser?.email,
            };

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    user: mockState.loggedInUser,
                    token,
                }),
            });
        }

        // Everything else → abort (never hit real backend)
        return route.abort();
    });

    return mockState;
}