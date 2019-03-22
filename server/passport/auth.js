var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var configAuth = require('../config/auth');

module.exports = function(passport) {
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName' /*,'provider', */, 'picture.type(large)' ,'email']
    }, function(accessToken, refreshToken, profile, done) {
         var newUser = {
            idProfile: profile.id,
            name : profile.displayName,
            photo: profile.photos[0].value.concat('0')
        }
        done(null, newUser);
    }));
    passport.use(new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL
    }, function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            var newUser = {
                idProfile: profile.id,
                name : profile.displayName,
                email: profile.emails[0].value,
                photo: profile.photos[0].value.concat('0')
            }
            return done(null, newUser);
        });
    }));

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

  passport.serializeUser(function(user, done) {
        done(null, user);
    });

}