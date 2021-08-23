var axios = require('axios');

var APIKEY;

const init_obtener_consumo = (user, password) => {

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
            obtener_consumo_request();
        })
        .catch(err => console.log(err));
}

const obtener_consumo_request = () => {

    // Params, header, url, method
    var config = {
        method: 'get',
        url: 'https://staging.ws.timbox.com.mx/api/obtener_consumo',
        headers: {
            'x-api-key': APIKEY,
            'Content-Type': 'application/json'
        },
        data:''
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
init_obtener_consumo('PIRD9607262M7', 'cr1xNPuHyYGnSTgJ5uVx');
