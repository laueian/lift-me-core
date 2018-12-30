const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const Keys = require("../config/keys")
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: Keys.google.clientID,
        clientSecret: Keys.google.clientSecret,
        callbackURL: "/auth/google/redirect"
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id }).then((currentUser) => {
            if (currentUser) {
                // already have this user
                done(null, currentUser)
            } else {
                // if not, create user in our db
                new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    thumbnail: profile._json.image.url
                }).save().then((newUser) => {
                    done(null, newUser)
                });
            }
        });
    })
);

passport.use(new FacebookStrategy({
    clientID: Keys.facebook.local.clientID,
    clientSecret: Keys.facebook.local.clientSecret,
    callbackURL: "/auth/facebook/redirect"
},
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ facebookId: profile.id }).then((currentUser) => {
            if (currentUser) {
                done(null, currentUser)
            } else {
                // if not, create user in our db
                new User({
                    facebookId: profile.id,
                    username: profile.displayName
                    //TODO Find a way to get profile picture
                }).save().then((newUser) => {
                    done(null, newUser)
                });
            }
        });
    })
);