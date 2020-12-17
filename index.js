const axios = require("axios");
const express = require("express");
const session = require("express-session");
const app = express();
const passport = require("passport");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { access } = require("fs");
const OAuth = require("oauth");
const { promisify } = require("util");
const { userInfo } = require("os");
const { MongoClient } = require("mongodb");
const User = require("./models/User");
const tweet = require("./models/tweet");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const port = process.env.PORT || 3000;
require("./passport")(passport);

// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: process.env.CLIENT_URL, // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);
app.use(
  session({
    secret: "vouch",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

/*
 *-----------DB CONNECTION-----------------
 */
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@vouch.c7dpd.mongodb.net/${process.env.COLLECTION_NAME}?retryWrites=true&w=majority`;
try {
  mongoose.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected")
  );
} catch (error) {
  console.log("could not connect");
}

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
  //   res.status(401).json({
  //     authenticated: false,
  //     message: "user has not been authenticated",
  //   });
    res.redirect(process.env.CLIENT_URL)
  } else {
    // console.log("logged in", req.authInfo.tokens.token);
    next();
  }
};

app.get("/", isLoggedIn, (req, res) => {
  // res.send(
  //   `<h1><a href="http://localhost:3000/auth/twitter">Twitter Top Links Login</a></h1><hr>`
  // );
  console.log("/");
  res.status(200).json({
    authenticated: true,
    message: "successful login",
    user: req.user,
  });
});

// -------------LOGIN-------------------------

// when login is successful, retrieve user info
app.get("/auth/login/success", (req, res) => {
  console.log("req.user", req.user);
  if (req.user) {
    res.json({
      success: true,
      message: "login successful",
      user: req.user,
    });
  }
});

// when login failed, send failed msg
app.get("/auth/login/failed", isLoggedIn, (req, res) => {
  res.status(401).json({
    success: false,
    message: "unsuccessful login",
  });
});

// --------------------------------------------------------

var ACCESS_TOKEN = "";
var ACCESS_TOKEN_SECRET = "";
var oauth_token = "";
var oauth_verifier = "";
var userjson;

app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter"),
  (req, res) => {
    console.log("pp callback");
    // scope[("email", "profile")];
    console.log(
      "Oauth tokens",
      req.query.oauth_token,
      req.query.oauth_verifier
    );
    oauth_token = req.query.oauth_token;
    oauth_verifier = req.query.oauth_verifier;

    ACCESS_TOKEN = req.authInfo.tokens.token;
    ACCESS_TOKEN_SECRET = req.authInfo.tokens.tokenSecret;

    // let profilepic = req.user.photos[0].value;
    userjson = req.user._json;
    console.log(req.user._json);

    res.redirect(process.env.CLIENT_URL);
  }
);

// app.get("/tweets", isLoggedIn, (req, res) => {
//   console.log(req.user);
// });

var resultList;
var tweetsWithUrl = [];
app.get("/tweetswithurl", isLoggedIn, (req, res) => {
  //get tweets and store in db
  getTwitterUserProfileWithOAuth1(req.user._json.screen_name)
    .then((tweetsArr) => {
      console.log("oauth1 response", JSON.stringify(tweetsArr, null, 2));
      results = JSON.stringify(tweetsArr, null, 2);
      resultArr = JSON.parse(results);
      resultList = resultArr;
      tweetsWithUrl = [];
      resultArr.forEach((result) => {
        // console.log(result.entities.urls[0].expanded_url || "no");
        if (result.entities.urls.length > 0) {
          tweetsWithUrl.push(result);
        }
      });
      // console.log("tid", req.user._json.id_str);
      User.findOneAndUpdate(
        { screen_name: userjson.screen_name },
        { $set: { tweets: tweetsWithUrl } },
        { tweets: tweetsWithUrl },
        function (err, data) {
          if (err) {
            console.log(err);
          } else {
            res.send(tweetsWithUrl);
            // res.redirect("/tweetswithurl");
            console.log("Data updated!", userjson);
            console.log("aaaaaaaaaaa", req.user.id);
          }
        }
      );
    })
    .catch((err) => console.error(err));
});

app.get(
  "/auth/twitter",
  passport.authenticate("twitter", {
    scope: ["profile", "email"],
  })
);

app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("http://localhost:3006"); //Inside a callback… bulletproof!
  });
});

app.get("/currentuser", isLoggedIn, (req, res) => {
  res.json(req.user._json);
});

app.get("/mostpopulardomain", isLoggedIn, (req, res) => {
  console.log("----------------", req.user);
  var screen_name = req.user.username;
  console.log(screen_name);
  console.log("User JSON", req.user._json);
  r = User.aggregate(
    [
      { $match: { screen_name: req.user.username } },
      {
        $group: {
          _id: "$tweets.user.screen_name",
        },
      },
      { $unwind: "$_id" },
      {
        $group: {
          _id: "$_id",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ],
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result[0]);
      }
    }
  );
});

app.get("/listofpopulardomains", isLoggedIn, (req, res) => {
  var screen_name = req.user.username;
  r = User.aggregate(
    [
      { $match: { screen_name: screen_name } },
      {
        $group: {
          _id: "$tweets.user.screen_name",
        },
      },
      { $unwind: "$_id" },
      {
        $group: {
          _id: "$_id",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      // {
      //   $project: {
      //     _id: "$_id",
      //   },
      // },
    ],
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    }
  );
});

const token = process.env.TOKEN;

async function getTwitterUserProfileWithOAuth1(username) {
  var oauth = new OAuth.OAuth(
    process.env.OAUTH_REQUEST_TOKEN_URL,
    process.env.OAUTH_ACCESS_TOKEN_URL,
    process.env.CONSUMER_KEY,
    process.env.CONSUMER_SECRET,
    "1.0A",
    null,
    "HMAC-SHA1"
  );
  const get = promisify(oauth.get.bind(oauth));

  console.log(ACCESS_TOKEN, ACCESS_TOKEN_SECRET);
  const body = await get(
    process.env.BASE_URL,
    ACCESS_TOKEN,
    ACCESS_TOKEN_SECRET
  );
  return JSON.parse(body);
}

if (process.env.NODE_ENV === "production") {
  //set static folder

  app.use(express.static("frontend/twitter-toplinks/build"));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(
        __dirname,
        "frontend",
        "twitter-toplinks",
        "build",
        "index.html"
      )
    );
  });
}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
