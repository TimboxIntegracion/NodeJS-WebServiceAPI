var axios = require('axios');

var APIKEY;

const init_buscar_cfdi = (user, password) => {

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
            buscar_cfdi_request();
        })
        .catch(err => console.log(err));
}

const buscar_cfdi_request = () => {

    // Declare params
    var payload = JSON.stringify({
        "parametros_cfdis": {
            "uuid": "44235C12-0BEF-4919-9B44-7F8BFE44D451"
        }
    });

    // Params, header, url, method
    var config = {
        method: 'get',
        url: 'https://staging.ws.timbox.com.mx/api/buscar_cfdi',
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
init_buscar_cfdi('PIRD9607262M7', 'cr1xNPuHyYGnSTgJ5uVx');
