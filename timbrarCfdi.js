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
        url: 'http://localhost:3000/api/auth',
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
        url: 'http://localhost:3000/api/timbrar_cfdi',
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
init_timbrar_cfdi('SCS140827JN4', 'zhZydMFF9v8E2YExynz_');