// router
const express = require('express');
const postRouters = express.Router();
const authMiddleware = require('../Middleware/AuthMiddleware');

// Controler
const {createPost, listPost} = require('../controllers/Posts');

const postRouter = (app) => {

    // postRouters.use(authMiddleware.isAuth);

    postRouters.post('/create', createPost);

    postRouters.get('/get-list', listPost);

    app.use('/post', postRouters);
};

module.exports = postRouter;
