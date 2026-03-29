import { sleep, group, check, fail } from 'k6'
import http from 'k6/http'
import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js'

export const options = {
    cloud: {
        distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
        apm: [],
    },
    thresholds: {},
    scenarios: {
        Login_and_Purchase: {
            executor: 'ramping-vus',
            gracefulStop: '30s',
            stages: [
                { target: 20, duration: '1m' },
                { target: 20, duration: '3m30s' },
                { target: 0, duration: '1m' },
            ],
            gracefulRampDown: '30s',
            exec: 'login_and_Purchase',
        },
    },
}

export function login_and_Purchase() {
    let response

    const vars = {}

    group('Home - https://pizza.jwt-pizza.click/', function () {
        // Login
        response = http.put(
            'https://pizza-service.jwt-pizza.click/api/auth',
            '{"email":"a@jwt.com","password":"admin"}',
            {
                headers: {
                    accept: '*/*',
                    'accept-encoding': 'gzip, deflate, br, zstd',
                    'accept-language': 'en-US,en;q=0.9',
                    'content-type': 'application/json',
                    origin: 'https://pizza.jwt-pizza.click',
                    priority: 'u=1, i',
                    'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'sec-gpc': '1',
                },
            }
        )

        vars['token'] = jsonpath.query(response.json(), '$.token')[0]

        sleep(3)
        check(response, { 'status equals 200': (response) => response.status.toString() === '200' });
        if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
            console.log(response.body);
            fail('Login was *not* 200');
        }

        // Get Menu
        response = http.get('https://pizza-service.jwt-pizza.click/api/order/menu', {
            headers: {
                accept: '*/*',
                'accept-encoding': 'gzip, deflate, br, zstd',
                'accept-language': 'en-US,en;q=0.9',
                authorization: `Bearer ${vars['token']}`,
                'content-type': 'application/json',
                origin: 'https://pizza.jwt-pizza.click',
                priority: 'u=1, i',
                'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'sec-gpc': '1',
            },
        })

        check(response, { 'status equals 200': (response) => response.status.toString() === '200' });
        if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
            console.log(response.body);
            fail('Get Menu was *not* 200');
        }

        // Get Franchise
        response = http.get(
            'https://pizza-service.jwt-pizza.click/api/franchise?page=0&limit=20&name=*',
            {
                headers: {
                    accept: '*/*',
                    'accept-encoding': 'gzip, deflate, br, zstd',
                    'accept-language': 'en-US,en;q=0.9',
                    authorization: `Bearer ${vars['token']}`,
                    'content-type': 'application/json',
                    origin: 'https://pizza.jwt-pizza.click',
                    priority: 'u=1, i',
                    'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'sec-gpc': '1',
                },
            }
        )

        check(response, { 'status equals 200': (response) => response.status.toString() === '200' });
        if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
            console.log(response.body);
            fail('Get Franchise was *not* 200');
        }

        response = http.get('https://pizza.jwt-pizza.click/x', {
            headers: {
                accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'accept-encoding': 'gzip, deflate, br, zstd',
                'accept-language': 'en-US,en;q=0.9',
                priority: 'i',
                'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'image',
                'sec-fetch-mode': 'no-cors',
                'sec-fetch-site': 'same-origin',
                'sec-gpc': '1',
            },
        })

        sleep(1)
        check(response, { 'status equals 200': (response) => response.status.toString() === '200' });
        if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
            console.log(response.body);
            fail('Get Franchise was *not* 200');
        }

        // Get User
        response = http.get('https://pizza-service.jwt-pizza.click/api/user/me', {
            headers: {
                accept: '*/*',
                'accept-encoding': 'gzip, deflate, br, zstd',
                'accept-language': 'en-US,en;q=0.9',
                authorization: `Bearer ${vars['token']}`,
                'content-type': 'application/json',
                origin: 'https://pizza.jwt-pizza.click',
                priority: 'u=1, i',
                'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'sec-gpc': '1',
            },
        })

        sleep(2)
        check(response, { 'status equals 200': (response) => response.status.toString() === '200' });
        if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
            console.log(response.body);
            fail('Get User was *not* 200');
        }

        // Order Pizzas
        response = http.post(
            'https://pizza-service.jwt-pizza.click/api/order',
            '{"items":[{"menuId":1,"description":"Veggie","price":0.0038},{"menuId":2,"description":"Pepperoni","price":0.0042},{"menuId":4,"description":"Crusty","price":0.0028},{"menuId":4,"description":"Crusty","price":0.0028}],"storeId":"1","franchiseId":1}',
            {
                headers: {
                    accept: '*/*',
                    'accept-encoding': 'gzip, deflate, br, zstd',
                    'accept-language': 'en-US,en;q=0.9',
                    authorization: `Bearer ${vars['token']}`,
                    'content-type': 'application/json',
                    origin: 'https://pizza.jwt-pizza.click',
                    priority: 'u=1, i',
                    'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'sec-gpc': '1',
                },
            }
        )

        vars['jwt'] = jsonpath.query(response.json(), '$.jwt')[0]
        sleep(2.4)
        check(response, { 'status equals 200': (response) => response.status.toString() === '200' });
        if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
            console.log(response.body);
            fail('Order Pizzas was *not* 200');
        }

        // Verify Pizza
        response = http.post(
            'https://pizza-factory.cs329.click/api/order/verify',
            JSON.stringify({ jwt: vars['jwt'] }),
            {
                headers: {
                    accept: '*/*',
                    'accept-encoding': 'gzip, deflate, br, zstd',
                    'accept-language': 'en-US,en;q=0.9',
                    authorization: `Bearer ${vars['token']}`,
                    'content-type': 'application/json',
                    origin: 'https://pizza.jwt-pizza.click',
                    priority: 'u=1, i',
                    'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'cross-site',
                    'sec-fetch-storage-access': 'active',
                    'sec-gpc': '1',
                },
            }
        )

        sleep(2)
        check(response, { 'status equals 200': (response) => response.status.toString() === '200' });
        if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
            console.log(response.body);
            fail('Verify Pizza was *not* 200');
        }
    })
}
