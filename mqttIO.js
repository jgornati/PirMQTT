/* NO FUNCIONA PORQUE SE CIERRA LA CONEXION CON EL BROCKER MQTT, ME ACORDE DE PEDO PORQUE CUANDO ESTABA HACIENDO
EL MQTTTEMP SI EXTENDIA EL TIEMPO DE PUSHEO DE LOS DATOS SE DESCONECTABA, LO MISMO PASA CON ESTE, AL ESTAR SIN RECIBIR MOVIMIENTO
SE DESCONECTA DEL BROKER MQTT!!!!! FUCKKKK HAY QUE ENCONTRAR UNA SOLUCION!!!*/
var mosca = require('mosca');
var Topics = require('./models/topics.js');
var io = module.parent.exports.io;
var globalChatID = false;
var AlarmArmed = false;
//!!!TELEGRAM
var TelegramBot = require('node-telegram-bot-api');
 
var token = '152404872:AAEfkkiE7opFzz-HlPL7HGHk4cRijP6uI0g';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});


var moscaSettings = {
  port: 1883
};

var authenticate = function(client, username, password, callback) {
  var authorized = (username === 'joel' && password.toString() === 'asd');
  if (authorized) client.user = username;
  callback(null, authorized);
};


var servermqtt = new mosca.Server(moscaSettings);

servermqtt.on('clientConnected', function(client) {
  console.log('client connected', client.id);
});

// fired when a message is received
servermqtt.on('published', function(packet, client) {
  console.log('Published ' + packet.payload);
  // console.log('Published ' + packet.topic);
  // console.log('Published ' + client);
  console.log(Date());
  var t = new Topics({
    TopicTime: Date(),
    TopicTema: packet.topic,
    TopicValue: packet.payload
  });
  
  t.save(function(err, doc){
    if(!err){
      console.log("guarde el paquete");
      console.log("el globalChatID:" + globalChatID);
      console.log(AlarmArmed);
      if(packet.topic == 'bat'){
        io.sockets.emit('bat', {tema: String(packet.topic), valor: String(packet.payload)});
      }
      if(globalChatID && AlarmArmed){
        console.log("SUENA LA ALARMA!!!!!!!!!!!!!!!!!!!!!");
        bot.sendMessage(globalChatID, "suena la alarma papa!!!!");
        bot.sendMessage(globalChatID, "suena la alarma papa!!!!");
        bot.sendMessage(globalChatID, "suena la alarma papa!!!!");
      }
      console.log(err, doc);
    }else{
      console.log("error al guardar papquete");
      console.log(doc);
    }
  });
});

servermqtt.on('ready', function setup() {
  servermqtt.authenticate = authenticate;
  console.log('Mosca server is up and running')
});



bot.on('text', function (msg) {
  var chatId = msg.chat.id;
  globalChatID = msg.chat.id; //variable global declarada dentro de la funcion cuando recibe el mensaje
  if(msg.text == "activar" || msg.text = "@NodelBot activar"){
    bot.sendMessage(chatId,"Alarma Activa");
    console.log(msg.chat.id)
    AlarmArmed = true;
  }else if(msg.text == "desactivar" || msg.text = "@NodelBot desactivar"){
    bot.sendMessage(chatId, "Alarma Desactivada");
    console.log(msg.chat.id)
    AlarmArmed = false;
  }else{
    bot.sendMessage(chatId, "Pedime algo coherente!")
    console.log(msg.chat.id)
  };
  
});



module.exports = servermqtt;
