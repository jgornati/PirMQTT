var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var topicSchema = new Schema({
  TopicTime: Date,
  TopicTema: String,
  TopicValue: String
});

var topicsModel = mongoose.model('Topics', topicSchema);
module.exports = topicsModel;
