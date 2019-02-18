const express = require('express')
const { body } = require('express-validator/check')
const feedController = require('../controllers/feed')

const router = express.Router()
const isAuth = require('../middlewares/isAuth')
// Current URL: /api/feed

router
  .route('/posts')
  .get(isAuth, feedController.getPosts)
  .post(
    isAuth,
    [
      body('title')
        .trim()
        .isLength({ min: 5 }),
      body('content')
        .trim()
        .isLength({ min: 5 })
    ],
    feedController.createPost
  )
router
  .route('/posts/:postId')
  .get(isAuth, feedController.getPost)
  .put(isAuth, feedController.updatePost)
  .delete(isAuth, feedController.deletePost)

module.exports = router
