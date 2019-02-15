const { validationResult } = require('express-validator/check')

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

const createPost = (req, res, next) => {
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
  // Create post in db
  res.json({
    message: 'Post created successfully!',
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      imagesUrl: 'assets/images/index.jpeg',
      creator: {
        name: 'Test'
      },
      date: new Date()
    }
  })
}

module.exports = {
  getPosts,
  createPost
}
