const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Favorites = require('../models/enroll');
const Courses = require('../models/courses');
const urls = require('../models/urls');
const cors = require('./cors');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({ user: req.user._id })
            .populate('user')
            .populate('courses')
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
                        favorite.courses.push(req.body[i]);
                    }
                    favorite.save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('courses')
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
                        if (!favorite[0].courses.includes(req.body[i]._id)) {
                            favorite[0].courses.push(req.body[i]);
                        }
                    }
                    favorite[0].save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('courses')
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

favoriteRouter.route('/:courseId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Courses.findById(req.params.courseId)
    .populate('comments.author')
    .then((course) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(course);
    }, (err) => next(err))
    .catch((err) => next(err));
})
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favorites.find({ user: req.user._id })
            .then((favorite) => {
                if (favorite.length == 0) {
                    var favorite = new Favorites();
                    favorite.user = req.user._id;
                    favorite.courses.push(req.params.courseId);
                    favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('courses')
                        .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                        })
                        }, (err) => next(err))                        
                } else {
                    if (favorite[0].courses.includes(req.params.courseId)) {
                        err = new Error('Course ' + req.params.courseId + ' already in favorites');
                        err.statusCode = 403;
                        return next(err);
                    } else {
                        favorite[0].courses.push(req.params.courseId);
                        favorite[0].save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('courses')
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
        res.end('Put operation not supported on /favorites/:courseId');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({ user: req.user._id })
            .then((favorite) => {
                if (favorite.length == 0) {
                    err = new Error('No favroites for user ' + req.params.user._id);
                    err.statusCode = 403;
                    return next(err);
                } else {
                    if (favorite[0].courses.includes(req.params.courseId)) {
                        index = favorite[0].courses.indexOf(req.params.courseId);
                        favorite[0].courses.splice(index,1);
                        favorite[0].save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('courses')
                            .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                            });
                            }, (err) => next(err))
                    } else {
                        err = new Error('Course ' + req.params.courseId + ' is not in favorites');
                        err.statusCode = 403;
                        return next(err);
                    }
                }

            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;