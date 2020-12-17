var mongoose = require("mongoose");
var User = require("./User");

const Tweet = new mongoose.Schema({
  created_at: String,
  tweet_id: String,
  text: String,
  url: String,
//   user: User,
});

module.exports = mongoose.model("tweet", Tweet);
