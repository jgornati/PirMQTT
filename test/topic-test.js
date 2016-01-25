var Topic = require('../models/topics');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pirDB');

var p = new Topic({
  TopicClientId: "joel",
  TopicTema: "terraza",
  TopicMsgId: "1",
  TopicTime: new Date()
});

p.save(function(err, doc){
  console.log(err, doc);
});
