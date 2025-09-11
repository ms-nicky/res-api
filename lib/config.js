const LocalStrategy = require('passport-local').Strategy;
const { getHashedPassword } = require('./functions');
const { User } = require('../MongoDB/schema');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        let hashed = getHashedPassword(password);
        let users = await User.findOne({ username: username });

        if (!users) {
          return done(null, false, {
            message: `<div class="alert alert-danger">
                  <button type="button" aria-hidden="true" class="close" data-dismiss="alert" aria-label="Close">
                    <i class="tim-icons icon-simple-remove"></i>
                  </button>
                  <span><b> Username not found </span>
                </div>`,
          });
        }

        if (username === users.username && hashed === users.password) {
          return done(null, users);
        } else {
          return done(null, false, {
            message: `<div class="alert alert-danger">
                  <button type="button" aria-hidden="true" class="close" data-dismiss="alert" aria-label="Close">
                    <i class="tim-icons icon-simple-remove"></i>
                  </button>
                  <span><b>Invalid not found</span>
                </div>`,
          });
        }
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // ✅ FIXED: ganti callback ke async/await
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};