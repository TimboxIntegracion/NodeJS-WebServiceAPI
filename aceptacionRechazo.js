var axios = require('axios');

var APIKEY;

const procesar_respuesta = (user, password) => {

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
            procesar_respuesta_request();
        })
        .catch(err => console.log(err));
}

const procesar_respuesta_request = () => {
    var emisor = "XIA190128J61"
    var uuid = "766428AF-101A-4EF8-XXXX-799270629076"
    var receptor = "XAXX010101000"
    var total = "0"

    var folio = { 'uuid': uuid, 'rfc_emisor': emisor, 'total': total, respuesta: 'A'}
    var folio_resp =[]
    folio_resp.push(folio)
    //var dato= { 'rfc_receptor': receptor,  respuestas: {folios_respuestas:folio}}
    // Declare params
    var payload = JSON.stringify({    
        'rfc_receptor': receptor,
        'respuestas':{folios_respuestas: folio_resp}, 
 
        'cert_pem': "-----BEGIN CERTIFICATE-----\
        -----END CERTIFICATE-----",
        'llave_pem': "-----BEGIN PRIVATE KEY-----\
        -----END PRIVATE KEY-----"
        })
           

    // Params, header, url, method
    var config = {
        method: 'post',
        url: 'https://staging.ws.timbox.com.mx/api/procesar_respuesta',
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
procesar_respuesta('USER','PASS');