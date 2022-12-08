var axios = require('axios');
var APIKEY;

const cancelacion = (user, password) => {

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
           cancelacion_request();
       })     
       .catch(err => console.log(err));
}

const cancelacion_request = () => {
    //Parametros
    var emisor = "XIA190128J61"
    var uuid = "766428AF-101A-4EF8-B897-799270629076"
    var receptor = "XAXX010101000"
    var total = "0.0"
    var motivo = "02"
    var folios_sustituto = ""

    var uuids = { 'uuid': uuid, 'rfc_receptor': receptor, 'total': total, 'motivo': motivo, 'folios_sustituto': folios_sustituto }
    var folios =[]
    folios.push(uuids)

    var payload = JSON.stringify({ 
    'rfc_emisor': emisor,
    'folios': {
        'folio': folios
    },
    'cert_pem': "-----BEGIN CERTIFICATE-----\
    -----END CERTIFICATE-----",
    'llave_pem': "-----BEGIN PRIVATE KEY-----\
    -----END PRIVATE KEY-----"
    });
  
    // Params, header, url, method
    var config = {
        method: 'post',
        url:'https://staging.ws.timbox.com.mx/api/cancelar_cfdi',
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
cancelacion('USER','PASS');