const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Favorites = require('../models/favorite');
const Dishes = require('../models/dishes');
const urls = require('../models/urls');
const cors = require('./cors');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite[0]);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({ user: req.user._id })
            .then((favorite) => {
                if (favorite.length == 0) {
                    var favorite = new Favorites();
                    favorite.user = req.user._id;
                    for (i = 0; i < req.body.length; i++) {
                        favorite.dishes.push(req.body[i]);
                    }
                    favorite.save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('dishes')
                            .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                            })
                            
                        }, (err) => next(err))                        
                } else {
                    console.log(req.body);
                    for (i = 0; i < req.body.length; i++) {
                        console.log("Body message is "+ req.body[i]._id);
                        if (!favorite[0].dishes.includes(req.body[i]._id)) {
                            favorite[0].dishes.push(req.body[i]);
                        }
                    }
                    favorite[0].save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('dishes')
                            .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                            })
                    }, (err) => next(err))

                }

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.remove({ user: req.user._id })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favorites.find({ user: req.user._id })
            .then((favorite) => {
                if (favorite.length == 0) {
                    var favorite = new Favorites();
                    favorite.user = req.user._id;
                    favorite.dishes.push(req.params.dishId);
                    favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                        })
                        }, (err) => next(err))                        
                } else {
                    if (favorite[0].dishes.includes(req.params.dishId)) {
                        err = new Error('Dish ' + req.params.dishId + ' already in favorites');
                        err.statusCode = 403;
                        return next(err);
                    } else {
                        favorite[0].dishes.push(req.params.dishId);
                        favorite[0].save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('dishes')
                            .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                            })
                            }, (err) => next(err))
                    }
                }

            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on /favorites/:dishId');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({ user: req.user._id })
            .then((favorite) => {
                if (favorite.length == 0) {
                    err = new Error('No favroites for user ' + req.params.user._id);
                    err.statusCode = 403;
                    return next(err);
                } else {
                    if (favorite[0].dishes.includes(req.params.dishId)) {
                        index = favorite[0].dishes.indexOf(req.params.dishId);
                        favorite[0].dishes.splice(index,1);
                        favorite[0].save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('dishes')
                            .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                            });
                            }, (err) => next(err))
                    } else {
                        err = new Error('Dish ' + req.params.dishId + ' is not in favorites');
                        err.statusCode = 403;
                        return next(err);
                    }
                }

            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;