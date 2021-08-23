var axios = require('axios');

var APIKEY;

const init_consulta_lco = (user, password) => {

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
            consulta_lco_request();
        })
        .catch(err => console.log(err));
}

const consulta_lco_request = () => {

    // Declare params
    var payload = JSON.stringify({
        "rfc": "ROPS670907FU1",
        "no_certificado": "00001000000407219892"
      });

    // Params, header, url, method
    var config = {
        method: 'get',
        url: 'https://staging.ws.timbox.com.mx/api/consulta_lco',
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
            console.error('ERROR:', err);
        });
}

// Start consulta Lco (user, password, rfc, no_certificado )
init_consulta_lco('PIRD9607262M7', 'cr1xNPuHyYGnSTgJ5uVx');
