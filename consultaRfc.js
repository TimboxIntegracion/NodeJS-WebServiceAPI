var axios = require('axios');

var APIKEY;

const init_consulta_rfc = (user, password) => {

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
            consulta_rfc_request();
        })      
        .catch(err => console.log(err));
}

const consulta_rfc_request = () => {

    // Declare params
    var payload = JSON.stringify({
        "rfc": "ROPS670907FU1"
    });
    
    // Params, header, url, method
    var config = {
        method: 'get',
        url: 'https://staging.ws.timbox.com.mx/api/consulta_rfc',
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
init_consulta_rfc('PIRD9607262M7', 'cr1xNPuHyYGnSTgJ5uVx');
