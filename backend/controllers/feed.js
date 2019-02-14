const getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: 'First post',
        content: 'This is dummy data'
      }
    ]
  })
}

const createPost = (req, res, next) => {
  console.log('creating posts')
  const title = req.body.title
  const content = req.body.content
  // Create post in db
  res.json({
    message: 'Post created successfully!',
    post: {
      id: new Date().toISOString(),
      title: title,
      content: content
    }
  })
}

module.exports = {
  getPosts,
  createPost
}
