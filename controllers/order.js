const {Order, CartItem} = require('../models/orderCartItem');
const User = require('../models/user');
const {errorHandler} = require('../helpers/dbErrorHandler');


module.exports = {
    create(req, res){
        console.log('create order:', req.body)
        console.log('printing order:', req.body.order)
        console.log('printing user:', req.body.order.user)
        console.log('req.profile:', req.profile)
        req.body.order.user = req.profile;
        const order = new Order(req.body.order);
        order.save((error, data) => {
            if(error) return res.status(400).json({
                error: errorHandler(error)
            });
 
            return res.json(data);
        });
    },
    
    addOrderToUserHistory(req, res, next){
        let history = [];

        req.body.order.products.forEach((item) => {
            history.push({
                _id: item._id,
                name: item.name,
                description: item.description,
                category: item.category,
                quantity: item.count,
                transaction_id: req.body.order.transaction_id,
                amount: req.body.order.amount
            });
        });

        User.findOneAndUpdate({_id: req.profile._id},
            {$push: {history: history}},
            {new: true},
            (err, data) => {
                if(err) return res.status(400).json({
                    error: 'Could not update user purchase history'
                });
                next();
        });
    },

    listOrders(req, res){
        Order.find()
        .populate('user', '_id name address')
        .sort('-created')
        .exec((err, orders) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            return res.json(orders);
        })
    },

    getStatusValues(req, res){
        return res.json(Order.schema.path('status').enumValues);
    },

    orderById(req, res, next, id){
        Order.findById(id)
        .populate('products.product', 'name price')
        .exec((err, order) => {
            if(err || !order){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            req.order = order;
            next();
        });
    },

    updateOrderStatus(req, res){
        Order.update({_id: req.body.orderId}, {$set: {status: req.body.status}}, (err, order) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(order);
        })
    }
}