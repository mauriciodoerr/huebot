var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector);

bot.dialog('/', [

    function (session) {
        builder.Prompts.text(session, "Hello, and welcome to QnA Factbot!What's your name?");
    },

    function (session, results) {

        session.userData.name = results.response;
        builder.Prompts.number(session, "Hi " + results.response + ", how many years have you been writing code?");
    },

    function (session, results) {

        session.userData.yearsCoding = results.response;
        builder.Prompts.choice(session, "What language do you love the most?", ["C#", "JavaScript", "TypeScript", "Visual FoxPro"]);
    },

    function (session, results) {

        session.userData.language = results.response.entity;

        session.send("Okay, " + session.userData.name + ", I think I've got it:" +
                    " You've been writing code for " + session.userData.yearsCoding + " years," +
                    " and prefer to use " + session.userData.language + ".");
    }]);
