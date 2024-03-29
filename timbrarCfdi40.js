var axios = require('axios');
var file64;
var APIKEY;

const cfdiFileHandler = () => {
   // File library
   const fs = require('fs')
   fs.readFile('cfdi_40.xml', 'utf8' , (err, data) => {
     if (err) {
       console.error(err)
       return
     }
     file64 = Buffer.from(data).toString('base64');
   })
}
const init_timbrar_cfdi = (user, password) => {
   // read File content and parse to 64
   cfdiFileHandler();

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
           timbrar_cfdi_request();
       })
       .catch(err => console.log(err));
}

const timbrar_cfdi_request = () => {

   // Declare params
   var payload = JSON.stringify({
       "sxml": file64
     });

   // Params, header, url, method
   var config = {
       method: 'post',
       url: 'https://staging.ws.timbox.com.mx/api/timbrar_cfdi_40',
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
init_timbrar_cfdi('usuario', 'password');