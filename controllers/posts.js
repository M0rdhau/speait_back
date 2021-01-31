const postRouter = require('express').Router()
const Post = require('../models/post')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')


postRouter.get('/', async(request, response) => {
  const posts = await Post
    .find({}).populate('comments').populate('users', {username: 1})
  response.json(posts)
})

postRouter.get('/:id', async (request, response) => {
  const post = await Post.findById(request.params.id)
  if(post){
    response.json(post)
  }else{
    response.status(404).end()
  }
})

postRouter.post('/', async (request, response) => {
  const body = request.body
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id){
    return response.status(401).json({error: 'token missing or invalid'})
  }
  const user = await User.findById(body.userId)

  const newPost = new Post({
    title: body.title,
    author: body.author,
    date: new Date(Date.now()).toUTCString(),
    content: body.content,
    user: user.id
  })

  const savedPost = await newPost.save()
  user.posts = user.posts.concat(savedPost.id)
  await user.save()

  response.json(savedPost)
})

postRouter.post('/:id/comments', async (request, response) => {


  const body = request.body.data
  console.log('received a request', body)

  const parentPost = await Post.findById(request.params.id)

  const comment = new Comment({
    author: body.author,
    text: body.text,
    date: Date.now().toString(),
    post: parentPost.id
  })

  const savedComment = await comment.save()
  parentPost.comments = parentPost.comments.concat(savedComment.id)
  await parentPost.save()

  response.json(savedComment)
})


module.exports = postRouter


