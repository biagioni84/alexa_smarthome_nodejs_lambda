var api = require('./api.js');
exports.handler = function (request, context) {
    log("DEGUG:", "Alexa request",  JSON.stringify(request));
    if (request.directive.header.namespace === 'Alexa.Discovery' && request.directive.header.name === 'Discover') {
        handleDiscovery(request, context, "");
    }
    else if (request.directive.header.namespace === 'Alexa.PowerController') {
        if (request.directive.header.name === 'TurnOn' || request.directive.header.name === 'TurnOff') {
            // log("DEBUG:", "TurnOn or TurnOff Request", JSON.stringify(request));
            handlePowerControl(request, context);
        }
    }
    else if (request.directive.header.namespace === 'Alexa.LockController') {
        handleLockControl(request, context);
    }
    function handleDiscovery(request, context) {
        var requestToken = request.directive.payload.scope.token;
        var list = api.getDeviceList(requestToken, function(res){
                res.on('data', function(d) {
                var payload = JSON.parse(d.toString('utf-8'));
                var header = request.directive.header;
                header.name = "Discover.Response";
                log("DEBUG", "Discovery Response: ", JSON.stringify({ header: header, payload: payload }));
                context.succeed({ event: { header: header, payload: payload } });
                });
        });
    }

    function log(message, message1, message2) {
        console.log(message + message1 + message2);
    }
    function handleLockControl(request, context){
        var command ={};
        var id = request.directive.endpoint.endpointId;
        if (request.directive.header.name === 'Lock' ){
        command = {url: "/device/" + id + "/execute/close"};
        }else if(request.directive.header.name === 'Unlock') {
        command = {url: "/device/" + id + "/execute/open"};
        }else{
            // TODO: respond command not handled
        }
        var requestToken = request.directive.endpoint.scope.token;
        var sendCommand = api.sendCommand(requestToken, command, function(res){
                res.on('data', function(d) {
                var resp = JSON.parse(d.toString('utf-8'));
                var responseHeader = request.directive.header;
                responseHeader.namespace = "Alexa";
                responseHeader.name = "Response";
                responseHeader.messageId = responseHeader.messageId + "-R";
                var c = {
                     properties: [{
                        namespace: "Alexa.LockController",
                        name: "lockState",
                        value: resp.lockState,
                        timeOfSample: new Date(),
                        uncertaintyInMilliseconds: 1000
                     }]
                };
                var response = {
                    context: c,
                    event: {header: responseHeader,
                            endpoint: request.directive.endpoint,
                            payload: {}
                    },
                };
                log("DEBUG", "Alexa.LockController ", JSON.stringify(response));
                context.succeed(response);
                });
        });
    }
    function handlePowerControl(request, context) {
        // get device ID passed in during discovery
        var requestMethod = request.directive.header.name;
        // get user token pass in request
        var requestToken = request.directive.endpoint.scope.token;
        var powerResult;
        var command ={};
        
        var id = request.directive.endpoint.endpointId;

        if (requestMethod === "TurnOn") {
            command = {url: "/device/" + id + "/execute/on"};
        }
       else if (requestMethod === "TurnOff") {
            command = {url: "/device/" + id + "/execute/off"};
        }

        var sendCommand = api.sendCommand(requestToken, command, function(res){
                res.on('data', function(d) {
                var resp = JSON.parse(d.toString('utf-8'));
                var responseHeader = request.directive.header;
                responseHeader.namespace = "Alexa";
                responseHeader.name = "Response";
                responseHeader.messageId = responseHeader.messageId + "-R";
                var c = {
                     properties: [{
                        namespace: "Alexa.PowerController",
                        name: "powerState",
                        value: resp.powerState,
                        timeOfSample: new Date(),
                        uncertaintyInMilliseconds: 1000
                     }]
                };
                var response = {
                    context: c,
                    event: {header: responseHeader,
                            endpoint: request.directive.endpoint,
                            payload: {}
                    },
                };
                log("DEBUG", "Alexa.PowerController ", JSON.stringify(response));
                context.succeed(response);
                });
        });

    }
};
