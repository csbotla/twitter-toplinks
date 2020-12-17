const TwitterStrategy = require("passport-twitter").Strategy;

const User = require("./models/User");

module.exports = function (passport) {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((id, done) => {
    //   User.findById(id).then((user) => {
    done(null, id);
    //   });
  });

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: "kVN7V0GSIsb9UVsekyDwgOqXc",
        consumerSecret: "FZfovqvQS1LkNoIuuSgJJZYThp1Lwil8AYVkXMk7AS2aR4RdHm",
        callbackURL: "https://intense-tor-92849.herokuapp.com/auth/twitter/callback",
      },
      function (token, tokenSecret, profile, cb) {
        console.log("pp authcte");
        User.findOne({ twitterid: profile.id }).then((currentUser) => {
          if (currentUser) {
            //already in db
          } else {
            new User({
              twitterid: profile.id,
              name: profile.displayName,
              screen_name: profile.username,
              created_at: profile._json.created_at,
              profile_background_color: profile._json.profile_background_color,
              profile_image_url_https: profile.photos[0].value,
            })
              .save()
              .then((newUser) => {
                console.log("new user created" + newUser);
              });
          }
        });
        // console.log(profile);
        return cb(null, profile, {
          tokens: { token: token, tokenSecret: tokenSecret },
        });
      }
    )
  );
};
