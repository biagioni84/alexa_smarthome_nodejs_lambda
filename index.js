const https = require('https');
exports.handler = function (request, context) {
    log("DEBUG:", "Alexa request",  JSON.stringify(request));
    handleRequest(request,context);
    function handleRequest(request, context) {
        // var requestToken = request.directive.payload.scope.token;
        var list = proxyCommand(request, function(res){
                res.on('data', function(d) {    
                var payload = JSON.parse(d.toString('utf-8'));
                log("DEBUG: ", "Server response", JSON.stringify( payload));

                // var header = request.directive.header;
                // header.name = "Discover.Response";
                // log("DEBUG", "Discovery Response: ", JSON.stringify({ header: header, payload: payload.payload }));
                context.succeed(payload);
                });
        });
    }
    function log(message, message1, message2) {
        console.log(message + message1 + message2);
    }
    function proxyCommand(request,success){
      var options = {
        host: '34.227.234.171',
        port: 443,
        rejectUnauthorized: false, // an insecure way to deal with self signed certs
        path: '/smarthome-skill',
        method: 'POST',
        headers: {
            "Content-Type" : "application/json",
            accept: '*/*'
        }
      };
      if(request.directive.payload.scope && request.directive.payload.scope.token){
       options.headers.token = request.directive.payload.scope.token;
      }else{
        options.headers.token = request.directive.endpoint.scope.token;
      }
      console.log(options);
      var body = JSON.stringify(request);
      var req = https.request(options, success);
      req.write(body);
      req.end();
      req.on('error', function(e) {
        console.error(e);
      });
    return "NO RETURN";
    }

};
