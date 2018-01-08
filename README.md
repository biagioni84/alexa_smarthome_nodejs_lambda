Alexa Skills
------------

(https://developer.amazon.com/docs/ask-overviews/build-skills-with-the-alexa-skills-kit.html)

A skill is an app available for alexa's users ( https://alexa.amazon.com/spa/index.html ) 
Available skill types:
    -Custom Skills (custom interaction model)
    -Smart Home Skills
    -Flash Briefing Skills
    -Video Skills

The skill determines how words and phrases are interpreted by alexa an it's relation to code execution. 
In the case of smarthome skills, the interaction model and utterances are fixed 
 https://developer.amazon.com/docs/smarthome/smart-home-skill-api-message-reference.html
 https://developer.amazon.com/docs/device-apis/message-guide.html
 https://developer.amazon.com/docs/smarthome/understand-the-smart-home-skill-api.html#what-kind-of-devices-are-supported


Implementing a skill:
	- amazon lambda function
	- webservices (custom skill only)

Smarthome skill:

https://developer.amazon.com/docs/smarthome/steps-to-build-a-smart-home-skill.html
- Register as developer and create amazon smarthome-skill https://developer.amazon.com/edw/home.html#/skills
- Create a lambda (https://aws.amazon.com/lambda/)
	Region must be N.Virginia. Lambda has to be created from blueprint alexa-smart-home-skill-adapter. Trigger will be generated, add the Application Id of the skill created
	Edit lambda code (https://github.com/biagioni84/alexa_smarthome_nodejs_lambda)
- go back to skill configuration and configure lambda's ARN (amazon resource name) and account linking info (OAuth2 credentials)
- user/tester has to activate skill https://alexa.amazon.com/spa/index.html
- use ECHOSIM or an alexa device for testing https://echosim.io/welcome

LWA (login with amazon)

https://sellercentral.amazon.com/gp/homepage.html?cor=login_NA&
we register a new app and obtain a client-id used for account linking of the skill

HOW IT WORKS (maybe?)

- we ask alexa to do something
- alexa checks which skill can handle it 
- alexa sends a request to our lambda with a token identifying the user, and the command sent (directive)
- we use the lambda as a proxy to communicate with our server
- the server verifies that the token sent is valid and the user is registered in our system (LWA)
- the server sends a request to the home but using stored credentials
- the server receives a response, and sends it back to the lambda
- lambda parses the response and replies to alexa
- alexa says OK 







