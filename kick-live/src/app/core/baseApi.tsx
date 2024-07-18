import axios from 'axios';


const BASE_API = 'https://kick-live.onrender.com/';

const baseApi = axios.create({
    baseURL: BASE_API,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default baseApi;
