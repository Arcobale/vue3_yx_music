import requests from './requests.js'

export function reqPersonalizedList(params) {
    return requests({
        method: 'get',
        url: `/personalized`,
        params
    })
}