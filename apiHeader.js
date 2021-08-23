var axios = require('axios');
var data = '';
var APIKEY;

const getApiKey = (user,psswd) => {

  const credentials_64 = Buffer.from(`${user}:${psswd}`).toString('base64');
  const auth = `Basic ${credentials_64}`;

  var config = {
    method: 'get',
    url: 'http://localhost:3000/api/auth',
    headers: {
      'Authorization': auth
    },
    data: data
  };

  axios(config)
    .then(res => {
      APIKEY = res.data.api_key;
    })
    .catch(err => console.log(err));
}

const getHeader = (apikey) => {
  header = {
    'x-api-key': apikey,
    'Content-Type': 'application/json'
  }
  return header;
}

module.exports = {
  auth: (user, password) => {
    getApiKey(user,password);
    console.log("HERE");
    setTimeout(()=>{
      console.log("asdf"+APIKEY)
      return APIKEY},200);
  },
  app_header: getHeader(APIKEY)
};


