var axios = require('axios');

var APIKEY;

const init_buscar_acuse = (user, password) => {

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
            buscar_acuse_request();
        })
        .catch(err => console.log(err));
}

const buscar_acuse_request = () => {

    // Declare params:
    // ** uuid must be array
    var payload = JSON.stringify({
        "parametros_acuse": {
            "uuids": {
                "uuid": [
                    "44235C12-0BEF-4919-9B44-7F8BFE44D451"
                ]
            }
        }
    });

    // Params, header, url, method
    var config = {
        method: 'get',
        url: 'https://staging.ws.timbox.com.mx/api/buscar_acuse_recepcion',
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

// Init (User, password)
init_buscar_acuse('PIRD9607262M7', 'cr1xNPuHyYGnSTgJ5uVx');
