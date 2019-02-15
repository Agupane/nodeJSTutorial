const { validationResult } = require('express-validator/check')
const Post = require('../models/post')

const getPosts = (req, res, next) => {
  console.log('returning posts')
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First post',
        content: 'This is dummy data',
        imagesUrl: 'assets/images/index.jpeg',
        creator: {
          name: 'Test'
        },
        date: new Date()
      }
    ]
  })
}

const createPost = async (req, res, next) => {
  console.log('creating posts')
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, data is incorrect',
      errors: errors.array()
    })
  }
  const title = req.body.title
  const content = req.body.content
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'assets/images/index.jpeg',
    creator: {
      name: 'Test'
    }
  })
  try {
    const result = await post.save()
    // Create post in db
    res.json({
      message: 'Post created successfully!',
      post: result
    })
  } catch (error) {
    console.error(error)
    res.status(422).json({
      message: 'Could not create post'
    })
  }
}

module.exports = {
  getPosts,
  createPost
}
