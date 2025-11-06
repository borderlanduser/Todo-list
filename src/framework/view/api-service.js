export default class ApiService {
    constructor(endPoint) {
        this._endPoint = endPoint;
    }

    async _load({
    url,
    method = 'GET',
    body = null,
    headers = new Headers(),
    }) {
        const fullUrl = `${this._endPoint}/${url}`;
        console.log(`API CALL: ${method} ${fullUrl}`, { body, headers });
        
        const response = await fetch(fullUrl, {method, body, headers});
        
        console.log(`API RESPONSE: ${response.status} ${response.statusText}`);
        
        try {
            ApiService.checkStatus(response);
            return response;
        } catch (err) {
            console.error('API ERROR:', err);
            ApiService.catchError(err);
        }
    }

    static parseResponse(response) {
        return response.json();
    }

    static checkStatus(response) {
        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }
    }

    static catchError(err) {
        throw err;
    }
}