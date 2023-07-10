<img src="https://cdn.pixabay.com/photo/2015/04/23/17/41/node-js-736399_1280.png"/>

<h1>Integracin Node JS - Timbox Web Service API REST</h1>

<p>En el presente documento se encuentra la documentación correspondiente a los snippets de código desarrollados en NodeJs v11.15.0, así como también las librerías externas utilizadas para realizar las solicitudes HTTP correspondientes a la API REST del proyecto de Web Service de Timbox.</p>


<p>Para realizar las solicitudes HTTP en node.js se utlizó la version de node 11.15.0 en conjunto con la biblioteca "axios" para realizar las peticiones HTTP</p>

<h4>Instalación de node:</h4>
<p>
    	Usando nvm
    	nvm install node

    	Usando apt
    	sudo apt install nodejs
</p>
<h4>Instalación de axios</h4>

    	npm install axios

<h4>Para realizar pruebas desde la terminal con el siguiente comando:</h4>

	    node archivo.js

<h4>Autenticación</h4>

<p>Se requiere una autenticación básica para generar una API-KEY</p>

<p> URL de autenticación:</p>
<ul>
    <li> Ambiente Producción <span> https://sistema.timbox.com.mx/api/auth </span>  </li>
    <li> Ambiente Pruebas <span> https://staging.ws.timbox.com.mx/api/auth</span></li>
</ul>

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
<ul>
    <li> Ambiente Producción <span> https://sistema.timbox.com.mx/api/buscar_acuse_recepcion </span>  </li>
    <li> Ambiente Pruebas <span> https://staging.ws.timbox.com.mx/api buscar_acuse_recepcion </span></li>
</ul>

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
                "Comprobante": [
                    {"uuid": "3E30C124-58FB-408B-84D6-C253E8E573F1"}
                ]
            }
        }
    });

    // Params, header, url, method
    var config = {
        method: 'post',
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
<ul>
    <li> Ambiente Producción <span> https://sistema.timbox.com.mx/api/buscar_cfdi </span>  </li>
    <li> Ambiente Pruebas <span> https://staging.ws.timbox.com.mx/api/buscar_cfdi </span></li>
</ul>

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
            "uuid": "3E30C124-58FB-408B-84D6-C253E8E573F1"
        }
    });

    // Params, header, url, method
    var config = {
        method: 'post',
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
init_buscar_cfdi('user','password');
```

<h4>Método Timbrar CFDI 4.0</h4>
<p> Para timbrar un XML debe enviarse el archivo cifrado en base 64.</p>
<ul>
    <li> Ambiente Producción <span> https://sistema.timbox.com.mx/api/timbrar_cfdi_40 </span>  </li>
    <li> Ambiente Pruebas <span> https://staging.ws.timbox.com.mx/api/timbrar_cfdi_40 </span></li>
</ul>

```
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
init_timbrar_cfdi('user', 'password');
```


<h4>Método Obtener Consumo </h4>
<ul>
    <li> Ambiente Producción <span> https://sistema.timbox.com.mx/api/obtener_consumo </span>  </li>
    <li> Ambiente Pruebas <span> https://staging.ws.timbox.com.mx/api/obtener_consumo </span></li>
</ul>

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
init_obtener_consumo('user', 'password');

```

<h4>Método Recuperar Comprobante</h4>
<ul>
    <li> Ambiente Producción <span> https://sistema.timbox.com.mx/api/recuperar_comprobante </span>  </li>
    <li> Ambiente Pruebas <span> https://staging.ws.timbox.com.mx/api/recuperar_comprobante </span></li>
</ul>

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
        "uuid":{
            "Comprobante":[{ "uuid": "44235C12-0BEF-4919-9B44-7F8BFE44D451"}]
            }
        })
           

    // Params, header, url, method
    var config = {
        method: 'post',
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
init_recuperar_comprobante('usuario', 'password');

```

<h4>Método Cancelación CFDI's</h4>
<p> A partir del 01 de enero de 2022 el SAT modificó el esquema para la cancelación de CFDI’s. A continuación se muestra toda la información relevante y relacionada al proceso de cancelación. </p>
<p> En el esquema anterior, los campos que debían añadirse a la petición eran los siguientes:
    <ul>
        <li> UUID </li>
        <li> Total </li>
        <li> RFCReceptor </li>
        <li> Certificado en formato PEM </li>
        <li> Llave en formato PEM <li>
    </ul>
    En el nuevo esquema, se añadieron los siguientes campos:
    <ul>
        <li> Motivo  </li>
        <li> Folio Sustituto </li>
    </ul>
</p>

<p> Se requiere el envio de los certificado y llave privada del CSD en .PEM </p>
<ul>
    <li> Ambiente Producción <span> https://sistema.timbox.com.mx/api/cancelar_cfdi </span>  </li>
    <li> Ambiente Pruebas <span> https://staging.ws.timbox.com.mx/api/cancelar_cfdi </span></li>
</ul>

```
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

```
<h4>Método Consulta Documentos Relacionados</h4>
<ul>
    <li> Ambiente Producción <span> https://sistema.timbox.com.mx/api/consultar_documento_relacionado </span>  </li>
    <li> Ambiente Pruebas <span> https://staging.ws.timbox.com.mx/api/consultar_documento_relacionado </span></li>
</ul>

```
var axios = require('axios');

var APIKEY;

const documento_relacionado = (user, password) => {

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
        "uuid": "44235C12-0BEF-4919-9B44-7F8BFE44D451",
        "rfc_receptor": "XIA190128J61",
        "cert_pem": "-----BEGIN CERTIFICATE-----\
        -----END CERTIFICATE-----",
        "llave_pem": "-----BEGIN PRIVATE KEY-----\
        -----END PRIVATE KEY-----"
        })
           

    // Params, header, url, method
    var config = {
        method: 'post',
        url: 'https://staging.ws.timbox.com.mx/api/consultar_documento_relacionado',
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
documento_relacionado('USER','PASS');
```

<h4>Método Consulta Peticiones Pendientes</h4>
<ul>
    <li> Ambiente Producción <span> https://sistema.timbox.com.mx/api/consultar_peticiones_pendientes </span>  </li>
    <li> Ambiente Pruebas <span> https://staging.ws.timbox.com.mx/api/consultar_peticiones_pendientes </span></li>
</ul>

```
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
peticiones_pendientes('USR','PASS');
```
<h4>Método Aceptación Rechazo</h4>
<ul>
    <li> Ambiente Producción <span> https://sistema.timbox.com.mx/api/procesar_respuesta</span>  </li>
    <li> Ambiente Pruebas <span> https://staging.ws.timbox.com.mx/api/procesar_respuesta </span></li>
</ul>

```
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
```
<h4>Método Consultar Estatus</h4>
<ul>
    <li> Ambiente Producción <span> https://sistema.timbox.com.mx/api/consultar_estaus </span>  </li>
    <li> Ambiente Pruebas <span> https://staging.ws.timbox.com.mx/api/consultar_estaus </span></li>
</ul>

```
var axios = require('axios');


var APIKEY;


const init_consultar_estatus = (user, password) => {


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
           consultar_estatus_request();
       })
       .catch(err => console.log(err));
}


const consultar_estatus_request = () => {


   // Declare params
   var payload = JSON.stringify({
           "uuid": "3E30C124-XXXX-XXXX-XXXX-C253E8E573F1",
		“rfc_emisor”: ‘’
     		“rfc_receptor”: “”
 		“total”: “0.0”
   });


   // Params, header, url, method
   var config = {
       method: 'get',
       url: 'https://staging.ws.timbox.com.mx/api/consultar_estatus',
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
init_buscar_cfdi('USER', 'PASS');
```

