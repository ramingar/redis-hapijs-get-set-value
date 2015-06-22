var Hapi = require('hapi');

var redisOpts = {
  "host": "localhost",
  "port": "6379"
};

var server = new Hapi.Server();
server.connection({ port: '3000' });

server.register({
  register: require('hapi-redis'),
  options: redisOpts
}, function () {

});

/* **** ROUTES ************************************************************** */
server.route( {
  method : "GET",
  path : "/redis/set/{key}/{value}",
  handler : function (request, reply) {
    var redisClient = request.server.plugins['hapi-redis'].client;

    redisClient.set(request.params.key, request.params.value, function (error, result) {
      if (error !== null) console.log("error: " + error);
      else {
        reply('The value for "' + request.params.key + '" is set to: ' + request.params.value);
      }
    });

  }
});

server.route( {
  method : "GET",
  path : "/redis/{key}",
  handler : function (request, reply) {
    var redisClient = request.server.plugins['hapi-redis'].client;

    redisClient.get(request.params.key, function (error, val) {
      if (error !== null) console.log("error: " + error);
      else {
        reply('The value for this key is ' + val);
      }
    });
  }
});
/* **** END: ROUTES ********************************************************* */

server.start();