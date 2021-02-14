import { END_POINT } from './config.js'

export default class HttpService {
    static async request({method = 'GET', path, body}) {
        const url = `${END_POINT}${path}`

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            ... (body && {
                body: JSON.stringify(body)
            })
        }

        const result = fetch(url, options)
            .then(this.errorHandler)
            .then(res => res.json())

        return result
    }

    static errorHandler(response) {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response
    }
}