const passport = require("passport");
const localStrategy = require("passport-local");
const googleStrategy = require("passport-google-oauth20").Strategy;
const mysql = require("../mysql");

passport.serializeUser((user, cb) => {
  console.log("serializeUser now");
  cb(null, user.account_id);
});

passport.deserializeUser((id, cb) => {
  console.log("deserializeUser now");
  mysql.query(
    `select * from login where account_id = '${id}'`,
    (err, result) => {
      cb(null, result[0]);
    }
  );
});

//local strategy

passport.use(
  new localStrategy(
    { usernameField: "userid", passwordField: "user_pass" },
    (userid, user_pass, cb) => {
      console.log("local");

      mysql.query(
        `select * from login where userid = '${userid}'`,
        (err, result) => {
          if (err) {
            console.log(err);
            return cb(err, null);
          }
          if (!result.length) {
            console.log("empty");
            return cb(null, false);
          }

          if (!(result[0].user_pass == user_pass)) {
            console.log(result[0]);
            console.log(user_pass);
            console.log("password incorrect");
            return cb(null, false);
          }
          console.log("correct");
          return cb(null, result[0]);
        }
      );
    }
  )
);

//google strategy

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, cb) => {}
  )
);
