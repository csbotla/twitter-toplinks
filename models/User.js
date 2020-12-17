var mongoose = require("mongoose");
var Tweet = require("./tweet");

/**
 */
const User = new mongoose.Schema({
  twitterid: String,
  name: String,
  screen_name: String,
  created_at: String,
  profile_background_color: String,
  profile_image_url_https: String,
  tweets: [],
});

module.exports = mongoose.model("User", User);
