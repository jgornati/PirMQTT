var Topics = require('../models/topics.js');

var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


// GET Lista de temp1 de la DB

router.get('/temp1', function(req, res){
//agrego las cabeceras para que no aparezca error "Access-COntroll....
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  Topics.find({TopicTema: "t1"},{TopicTime: 1, TopicValue: 1, _id: 0}, function(err, docs) {
    res.json(docs);
  });
});

// GET Lista de hum1 de la DB
router.get('/hum1', function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  Topics.find({TopicTema: "h1"},{TopicTime: 1, TopicValue: 1, _id: 0}, function(err, docs) {
     res.json(docs);
  });
});
module.exports = router;
