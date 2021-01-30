const rssRouter = require('express').Router()
const Post = require('../models/post')
const xml = require('xml')


rssRouter.get('/',  async (request, response) => {
  const posts = await Post
    .find({})

  const post = [
    {title: 'test title'},
    {author: 'test author'},
    {content: 'test content'}
  ]

  const xmlObject = xml({document: post}, {declaration: true})
  console.log(xmlObject)
  console.log(post)
  response.set('Content-Type', 'text/xml');
  response.send(xmlObject)
})

module.exports = rssRouter
