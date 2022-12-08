var axios = require('axios');

var APIKEY;

const documento_relacionado = (user, password) => {

    // Get API key first
    const credentials_64 = Buffer.from(`${user}:${password}`).toString('base64');
    const auth = `Basic ${credentials_64}`;

    var config = {
        method: 'get',
        url: 'https://staging.ws.timbox.com.mx/api/auth',
        headers: {
            'Authorization': auth
        },
    };

    axios(config)
        .then(res => {
            APIKEY = res.data.api_key;
            documento_relacionado_request();
        })
        .catch(err => console.log(err));
}

const documento_relacionado_request = () => {

    // Declare params
    var payload = JSON.stringify({
        "uuid": "44235C12-0BEF-4919-9B44-7F8BFE44D451",
        "rfc_receptor": "XIA190128J61",
        "cert_pem": "-----BEGIN CERTIFICATE-----\
        -----END CERTIFICATE-----",
        "llave_pem": "-----BEGIN PRIVATE KEY-----\
        -----END PRIVATE KEY-----"


           })


    // Params, header, url, method
    var config = {
        method: 'get',
        url: 'https://staging.ws.timbox.com.mx/api/consultar_documento_relacionado',
        headers: {
            'x-api-key': APIKEY,
            'Content-Type': 'application/json'
        },
        data: payload
    }

    axios(config)
        .then((res) => {
            console.log(JSON.stringify(res.data))
        })
        .catch((err) => {
            console.error('ERROR:', err.response.data.message);
        });
}

// Init (user, password)
documento_relacionado('usuario', 'password');
