<img src="https://cdn.pixabay.com/photo/2015/04/23/17/41/node-js-736399_1280.png"/>

<h1>Integracin Node JS - Timbox Web Service API REST</h1>

<p>En el presente documento se encuentra la documentación correspondiente a los snippets de código desarrollados en NodeJs v11.15.0, así como también las librerías externas utilizadas para realizar las solicitudes HTTP correspondientes a la API REST del proyecto de Web Service de Timbox.</p>

<ul>
    <li>Timbrar_cfdi</li>
    <li>Buscar_cfdi</li>
    <li>Buscar_acuses</li>
    <li>Recuperar_comprobante</li>
    <li>Obtener_consumo</li>
    <li>Consulta_lco</li>
    <li>Consulta_lrfc</li>
</ul> 

<p>Para realizar las solicitudes HTTP en node.js se utlizó la version de node 11.15.0 en conjunto con la biblioteca "axios" para realizar las peticiones HTTP</p>

<h4>Instalación de node:</h4>
<p>
    	Usando nvm
    	nvm install node

    	Usando apt
    	sudo apt install nodejs
</p>
<h4>Instalación de axios</h4>
<p>
    	npm install axios
</p>
<h4>Para realizar pruebas desde la terminal con el siguiente comando:</h4>
<p>
	node archivo.js
</p>
<h4>Autenticación</h4>

<p>Se requiere una autenticación básica para generar una API-KEY</p>

<p> URL de autenticación:</p>
<span> https://staging.ws.timbox.com.mx/api/auth</span>

<h4>Snippet de Autenticación</h4>

<p> El siguiente codigo hace una solicitud a la API del Web Service de Timbox para generar una API KEY y enviarla en conjunto en cada petición posterior. Esta función necesita como parámetros el usuario y la contraseña proporcionados en la cuenta del dashboard de Timbox.</p>

<p>El formato para enviar las credenciales es el siguiente:</p>

	usuario:contraseña
	
<p>Por esta razón se concatenan los textos y se deben transformar a base 64 para poder enviarlos correctamente.</p>

```
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
           buscar_acuse_request();})
       .catch(err => console.log(err));
}
```

<h4>Método Buscar Acuse</h4>

```
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
init_buscar_acuse('user','password');
```

<h4>Método Buscar CFDI</h4>

```
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
```

<h4>Método Timbrar CFDI </h4>
<p> Para timbrar un XML debe enviarse el archivo cifrado en base 64.</p>

```
var axios = require('axios');
var file64;
var APIKEY;

const cfdiFileHandler = () => {
   // File library
   const fs = require('fs')
   fs.readFile('cfdi_33.xml', 'utf8' , (err, data) => {
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
       url: 'https://staging.ws.timbox.com.mx/api/timbrar_cfdi',
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
init_timbrar_cfdi('user', 'password');
```
<h4>Método Obtener Consumo </h4>

```
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
           'Authorization': auth },
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
           'Content-Type': 'application/json' },
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
init_obtener_consumo('user', 'password');
```
<h4>Método Recuperar Comprobante</h4>

```
var axios = require('axios');
var APIKEY;

const init_recuperar_comprobante = (user, password) => {
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
           recuperar_comprobante_request();
       })
       .catch(err => console.log(err));
}

const recuperar_comprobante_request = () => {

   // Declare params
   var payload = JSON.stringify({
       "uuids": ["44235C12-0BEF-4919-9B44-7F8BFE44D451"]
   });

   // Params, header, url, method
   var config = {
       method: 'get',
       url: 'https://staging.ws.timbox.com.mx/api/recuperar_comprobante',
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
init_recuperar_comprobante('PIRD9607262M7', 'cr1xNPuHyYGnSTgJ5uVx');
```
<h4>Consulta RFC</h4>

```
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
init_consulta_rfc('user','password');
```
<h4>Consulta LCO</h4>

```
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

// Start consulta Lco (user, password)
init_consulta_lco('user','password');

```
