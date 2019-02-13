const User = require('../model/User')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const Post = require('../model/Post')

module.exports = {
  hello() {
    return {
      text: 'Hello World!',
      views: 1234
    }
  },
  createUser: async ({ userInput }, req) => {
    const errors = []
    const email = userInput.email
    if(!validator.isEmail(userInput.email)) {
      errors.push({message: 'Email is invalid'})
    }
    if(validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 5 })) {
      errors.push({ message: 'Password is too short'})
    }
    if(errors.length>0){
      const error = new Error('Invalid Input')
      error.data = errors
      errors.code = 422
      throw error
    }
    const existingUser = await User.findOne({email: userInput.email})
    if(existingUser) {
      const error = new Error('User already exists')
      throw error
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12)
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw
    })
    const createUser = await User.save()
    return { ...createdUser._doc, _id: createdUser._id.toString()}
  },
  login: async ({email, password}) => {
    const user = await User.findOne({email: email})
    if(!user) {
      const error = new Error('User not found')
      error.code = 401
      throw error
    }
    const isEqual = await bcrypt.compare(password, user.password)
    if(!isEqual) {
      const error = new Error('Password is incorrect')
      error.code = 401
      throw error
    }
    const token = jwt.sign({
      userId: user._id.toString(),
      email: user.email
    }, 'supersecretpk', {expiresIn: '1h'})
    return { token: token, userId: user._id.toString()}
  },
  createPost: async ({ postInput }, req ) => {
    if(!req.isAuth) {
      const error = new Error('Not authenticated')
      error.code = 401
      throw error
    }
    const errors = []
    if(validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, {min: 5})) {
      errors.push({message: 'Content is invalid'})
    }
    if(errors.length>0){
      const error = new Error('Invalid Input')
      error.data = errors
      errors.code = 422
      throw error
    }
    const user = await User.findById(req.userId)
    if(!user) {
      const error = new Error('Invalid user')
      error.code = 401
      throw error
    }
    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: user
    })
    const createdPost = await post.save()
    user.posts.push(createdPost)
    await user.save()
    return {...createdPost._doc, _id: createdPost._id.toString(), createdAt: createdPost.createdAt.toISOString(), updatedAt: createdPost.updatedAt.toISOString()}
  }
}