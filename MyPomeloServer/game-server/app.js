var pomelo = require('pomelo');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'MyPomeloServer');

// app configuration
// app.configure('production|development', 'connector', function(){
//   app.set('connectorConfig',
//     {
//       connector : pomelo.connectors.hybridconnector,
//       heartbeat : 3,
//       useDict : true,
//       useProtobuf : true
//     });
// });

// app configuration
app.configure('production|development', 'connector', function () {
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector,
            heartbeat: 3,
        });
});

app.configure('production|development', 'gate', function () {
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector,
            useProtobuf: true
        });
});

// memcached
app.configure("production|development", function () {
    app.loadConfig("memcached", app.getBase() + "/config/memcached.json");
    var memclient = require("./app/dao/memcached/memcached").init(app);
    app.set("memclient", memclient);
});


// start app
app.start();

process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});
