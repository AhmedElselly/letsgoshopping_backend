const Category = require('../models/category');
const {errorHandler} = require('../helpers/dbErrorHandler');

module.exports = {
    categoryById(req, res, next, id){
        Category.findById(id).exec((err, category) => {
            if(err) return res.status(400).json({error: 'Such category not found!'});
            req.category = category;
            next();
        })
    },

    create(req, res, next){
        Category.create(req.body).then(function(category){
            res.json({category});
        }).catch(err => res.status(400).json({error: errorHandler(err)}));
    },

    read(req, res, next){
        return res.json(req.category);
    },

    update(req, res, next){
        const category = req.category;
        category.name = req.body.name;
        category.save((err, result) => {
            if(err) return res.status(400).json({error: errorHandler(err)});
            res.json({result});
        })
    },

    remove(req, res, next){
        const category = req.category;
        category.remove((err, result) => {
            if(err) return res.status(400).json({error: errorHandler(err)});
            res.json({message: 'Category deleted!'});
        })
    },

    list(req, res, next){
        Category.find().exec((err, result) => {
            if(err) return res.status(400).json({error: 'There is no category found!'});
            res.json(result)
        })
    }
}