const https = require('https');

function getDeviceList(token,success){
  var options = {
    host: 'some_host',
    port: 443,
    rejectUnauthorized: false, // an insecure way to deal with self signed certs
    path: '/network',
    method: 'GET',
    headers: {
        accept: '*/*'
    }
  };
  options.headers.token = token;
  console.log(options);
  var req = https.request(options, success);
  req.end();
  
  req.on('error', function(e) {
    console.error(e);
  });
 return "NO RETURN";
}

function sendCommand(token, command, success){
  var options = {
    host: 'some_host',
    port: 443,
    rejectUnauthorized: false, // an insecure way to deal with self signed certs
    path: '/command',
    method: 'POST',
    headers: {
        "Content-Type" : "application/json",
        accept: '*/*'
    }
  };
  options.headers.token = token;
  console.log(options);
  var body = JSON.stringify(command);
  var req = https.request(options, success);
  req.write(body);
  req.end();
  req.on('error', function(e) {
    console.error(e);
  });
 return "NO RETURN";
}
module.exports.getDeviceList = getDeviceList;
module.exports.sendCommand = sendCommand;
