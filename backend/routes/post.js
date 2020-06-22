// router
const express = require('express');
const postRouters = express.Router();
const authMiddleware = require('../Middleware/AuthMiddleware');

// Controler
const { createPost, listPost, getPaths, findPost, findByUser } = require('../controllers/Posts');

const postRouter = (app) => {

    // postRouters.use(authMiddleware.isAuth);

    postRouters.post('/create', createPost);

    postRouters.get('/get-list', listPost);

    postRouters.get('/get-paths', getPaths);

    postRouters.get('/get-post-user', authMiddleware.isAuth, findByUser);

    postRouters.get('/get-post/:id?', findPost);

    app.use('/post', postRouters);
};

module.exports = postRouter;
