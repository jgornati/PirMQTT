//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//NO LO USO PORQUE USAR mqttIO.js                                  +
//GUARDA MAL LOS DATOS Y NO ESTAMPA EL TIEMPO                      +
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var mosca = require('mosca')
var io = module.parent.exports.io;

var dbsetting = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'mqttDB',
  mongo: {}
};

var moscaSettings = {
  port: 1883,
  backend: dbsetting,
  persistence: {
    factory: mosca.persistence.Mongo,
    url: 'mongodb://localhost:27017/mqtt'
  }
};

var authenticate = function(client, username, password, callback) {
  var authorized = (username === 'joel' && password.toString() === 'asd');
  if (authorized) client.user = username;
  callback(null, authorized);
};

var servermqtt = new mosca.Server(moscaSettings);

servermqtt.on('clientConnected', function(client) {
  console.log('client connected', client.id);
  io.sockets.emit('client', {cliente:String(client.id)});
});

// fired when a message is received
servermqtt.on('published', function(packet, client) {
  console.log('Published ' + packet.payload);
  if(packet.topic = 't1'){
    io.sockets.emit('t1', {tema: String(packet.topic), valor: String(packet.payload)});
  }
  if(packet.topic = 'h1'){
    io.sockets.emit('h1', {tema: String(packet.topic), valor: String(packet.payload)});
  }
  // io.sockets.emit('topic', {tema: String(packet.topic), valor: String(packet.payload),});
});

servermqtt.on('ready', function setup() {
  servermqtt.authenticate = authenticate;
  console.log('Mosca server is up and running')
});
