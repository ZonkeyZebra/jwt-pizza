import { sleep, group } from 'k6'
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
        sleep(2.4)

        // Verify Pizza
        response = http.post(
            'https://pizza-factory.cs329.click/api/order/verify',
            '{"jwt":"eyJpYXQiOjE3NzQzODk5OTIsImV4cCI6MTc3NDQ3NjM5MiwiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9TcF94VzhlM3kwNk1KS3ZIeW9sRFZMaXZXX2hnTWxhcFZSUVFQVndiY0UifQ.eyJ2ZW5kb3IiOnsiaWQiOiJjZ2JsYWNrNSIsIm5hbWUiOiJDZWNpbHkgQmxhY2sifSwiZGluZXIiOnsiaWQiOjEsIm5hbWUiOiLluLjnlKjlkI3lrZciLCJlbWFpbCI6ImFAand0LmNvbSJ9LCJvcmRlciI6eyJpdGVtcyI6W3sibWVudUlkIjoxLCJkZXNjcmlwdGlvbiI6IlZlZ2dpZSIsInByaWNlIjowLjAwMzh9LHsibWVudUlkIjoyLCJkZXNjcmlwdGlvbiI6IlBlcHBlcm9uaSIsInByaWNlIjowLjAwNDJ9LHsibWVudUlkIjo0LCJkZXNjcmlwdGlvbiI6IkNydXN0eSIsInByaWNlIjowLjAwMjh9LHsibWVudUlkIjo0LCJkZXNjcmlwdGlvbiI6IkNydXN0eSIsInByaWNlIjowLjAwMjh9XSwic3RvcmVJZCI6IjEiLCJmcmFuY2hpc2VJZCI6MSwiaWQiOjkwMn19.iuPYuIBMGG4bkGdVXtBPLTDoDjpcRh5AFYTv1yY992l008vliNuxhqTuwgNUQD9AXv1MiZeqxvPIK2bhH2tlyZXf77hPZL9DqXdsuCUF76ZttoeYPdN93n_rDJ0YhOKDtljCSiQBjD3WNaMarwUZ52wEhFxLOrv5t4eY2DmBLjXq5xs33jL4i31XUOR1jXxXRNe0AqE2qsvjv8nJe92tLVyTgF0fJXD2mO4TIuF6uY7ljFoCZR9ma4QfYxcgU8ASzjsULet6XLEfR4eHARi9KnGu29Bfzarx_PT8E6t-st-s5WMPDUIOgJJLZf4M_ulQUGS7RGs25TfKBIRjfGc2BZ0frkHhp-7fsjDhRiNc0AY0ti_t7rPkNtKh5MvPlPaEj8pG1im2yQ734GIjO-0LWzbCiw3lHoHuNoCyaxagLSLZ3Y_7ThO_aMoPgUc2qSrdROk6XjdiyVdSBdrYOPEwMft6FlJiQfuJTE8490fdK6EYZPGB6CRodP4ohVNrGYroCs5sLPG9lNevLNuquLmWC76_S5UUBj1WebX8PVoQI_BpoDlBSbKasihG3TJmqymMd2HqkbaJK8WHvwqIf9_pSJyjoImbua2tN_X5804HBkRRnWPJXOS67GyV9DTUFHECp4nDi1YHnEBwXJeF94yhcok5Zhf04K7Npjpk4q0O0cI"}',
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

        // Logout
        response = http.del('https://pizza-service.jwt-pizza.click/api/auth', null, {
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
    })
}
