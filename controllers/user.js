const User = require('../models/user');
const {Order, CartItem} = require('../models/orderCartItem');
const {errorHanlder} = require('../helpers/dbErrorHandler');

module.exports = {
    userById(req, res, next, id){
        User.findById(id).exec((err, user) => {
            if(err || !user){
                return res.status(400).json({
                    error: 'User not found!'
                });
            }
            req.profile = user;
            next();
        });
    },

    read(req, res, next){
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;

        return res.json(req.profile);
    },

    update(req, res, next){
        User.findOneAndUpdate({_id: req.profile._id}, {$set: req.body}, {new: true}, function(err, user){
            if(err) return res.status(400).json({error: 'You are not authorized to perform this action.'});
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        });
    },

    purchaseHistory(req, res, next){
        Order.find({user: req.profile._id})
        .populate('user', '_id name')
        .sort('-created')
        .exec((err, orders) => {
            if(err){
                return res.status(400).json({
                    error: errorHanlder(err)
                });
            }
            return res.json(orders);
        })
    }
}