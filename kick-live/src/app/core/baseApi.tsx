import axios from 'axios';


const BASE_API = 'http://127.0.0.1:8000/';

const baseApi = axios.create({
    baseURL: BASE_API,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default baseApi;