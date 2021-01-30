const postRouter = require('express').Router()
const Post = require('../models/post')
const Comment = require('../models/comment')

postRouter.get('/', async(request, response) => {
  const posts = await Post
    .find({}).populate('comments')

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

  const newPost = new Post({
    title: body.title,
    author: body.author,
    date: Date.now().toString(),
    content: body.content
  })

  const savedPost = await newPost.save()
  response.json(savedPost)
})

postRouter.post('/:id/comments', async (request, response) => {
  const body = request.body

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


