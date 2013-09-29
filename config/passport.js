var LocalStrategy = require('passport-local').Strategy;
var ObjectID = require('mongodb').ObjectID;

module.exports = function (passport, db){
  db.collection('users', function (err, users){

    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
      users.findOne({_id: new ObjectID(id)}, function(err, user) {
        done(err, user);
      });
    });

    passport.use(new LocalStrategy(
      function(username, password, done) {
        users.findOne({
          username: username
        }, function(err, user){
          if (err) return done(err);
          if (!user) return done(null, false, {message: 'no user found...'});
          if (user.password != password) return done(null, false, {message: 'wrong password'});
          return done(null, user);
        })
      }
    ));

  }); 
}