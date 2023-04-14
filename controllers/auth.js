const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const {errorHandler} = require('../helpers/dbErrorHandler');

module.exports = {
    register(req, res, next){
        const user = new User(req.body);
        user.save((err, user) => {
            if(err) return res.status(400).json({error: errorHandler(err)});
            user.salt = undefined;
            user.hashed_password = undefined;
            return res.json({user});
        });
    },

    login(req, res, next){
        // find the user based on email
        const {email, password} = req.body;
        User.findOne({email}, function(err, user){
            if(err || !user){
                return res.status(400).json({error: 'User with that email doesn\'nt exist! Please register.'});
            }
            // if user is found make sure that email and password match 
            // create authenticate method for user model
            if(!user.authenticate(password)){
                return res.status(401).json({
                    error: 'Email and password don\'t match!'
                });
            }
            // generate a signed token with user id and secret
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
            // persist the token as 't' in cookie in expiry date
            res.cookie('t', token, {expire: new Date() + 9999});

            // return response with user and token in front end client
            const {_id, email, name, role} = user;
            return res.json({token, user: {_id, name, email, role}});
        })
    },

    logout(req, res, next){
        res.clearCookie('t');
        res.json({message: 'Signout Success'});
    },

    // middlewares
    requireSignin: expressJwt({
        secret: process.env.JWT_SECRET,
        userProperty: 'auth'
    }),

    isAuth(req, res, next){
        let user = req.profile && req.auth && req.profile._id == req.auth._id;
        if(!user){
            return res.status(403).json({
                error: 'Access denied'
            });
        }
        next();
    },

    isAdmin(req, res, next){
        if(req.profile.role === 0){
            return status.status(403).json({error: 'Admin resource! access denied.'});
        }
        next();
    }
}