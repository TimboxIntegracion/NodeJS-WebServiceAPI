var axios = require('axios');
var APIKEY;

const peticiones_pendientes = (user, password) => {

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
           peticiones_pendientes_request();
       })     
       .catch(err => console.log(err));
}

const peticiones_pendientes_request = () => {

   // Declare params
   var payload = JSON.stringify({
         "rfc_receptor": "XIA190128J61",
         'cert_pem':"-----BEGIN CERTIFICATE-----\
         -----END CERTIFICATE-----",
         'llave_pem':"-----BEGIN PRIVATE KEY-----\
         -----END PRIVATE KEY-----"
   });

  
   // Params, header, url, method
   var config = {
       method: 'post',
       url:'https://staging.ws.timbox.com.mx/api/consultar_peticiones_pendientes',
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
peticiones_pendientes('usuario','contraseña');