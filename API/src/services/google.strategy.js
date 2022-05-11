const passport = require("passport");
const config = require("./config");

const GoogleTokenStrategy = require("passport-google-token").Strategy;
const { createUser, getUserByEmail } = require("../controller/users");

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: config.googleClientID,
      clientSecret: config.googleClientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
      const [{ value: email }] = profile.emails;
      let user = await getUserByEmail(email);
      if (!user) {
        await createUser({
          body: {
            Fullname: profile.displayName,
            Email: email,
            Image: profile._json.picture,
          },
        });
        user = await getUserByEmail(email);
      }
      return done(null, {
        User_ID: user.User_ID,
        Fullname: user.Fullname,
        Email: user.Email,
      });
    }
  )
);

module.exports = passport;
