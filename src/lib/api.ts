const BASE_URL = process.env.EXPO_BASE_URL || "http://192.168.1.159:4000"

export interface Book {
    ISBN: string;
}


async function handleResponse(response: Response) {
    if (!response.ok) {
        let responseMessage = `HTTP Error: ${response.status}`
        try {
            const errorData = await response.json()
            responseMessage = errorData.error
        } catch (err) {
            throw new Error(`response status: ${response.status}`)
        }
        throw new Error(responseMessage)
    }
    return await response.json()
}

async function fetchData(path: string, options: RequestInit) {
    const URL = `${BASE_URL}/api/${path}`
    console.log("URL:", URL)
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json')
    
    let response = await fetch(URL, { ...options, headers })
    
    return handleResponse(response)
}

function get(path: string) {
    return fetchData(path, {method: 'GET'})
}

function post(path: string, body: object) {
    return fetchData(path, {method: 'POST', body: JSON.stringify(body)})
}

function patch(path: string, body: object) {
    return fetchData(path, {method: 'PATCH', body: JSON.stringify(body)})
}

export const api = {
    saveBook: (data: Book) => {
        return post('books', {data})
    },
    getBook: (isbn: string) => {
        return get(`books/${isbn}`)
    }
}