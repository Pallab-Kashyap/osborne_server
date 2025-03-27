const axios = require('axios');

const axiosInstance = axios.create({
    baseURL: 'https://www.osbornebooks.co.uk/api',  
    timeout: 5000, 
    headers: {
        'Content-Type': 'application/json',  
    },
    responseType: 'json',  
});

module.exports = axiosInstance;