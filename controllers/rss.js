const rssRouter = require('express').Router()
const Post = require('../models/post')
const xml = require('xml')
const marked = require('marked')


rssRouter.get('/',  async (request, response) => {
  const posts = await Post
    .find({})

  const rssObject = {
    rss: [
      {
        _attr: {
          version: '2.0',
          'xmlns:atom': 'http://www.w3.org/2005/Atom'
        }
      },
      {
        channel: [
          {
            'atom:link': {
              _attr: {
                href: 'https://oxbaa.herokuapp.com/feed.rss',
                rel: 'self',
                type: 'application/rss+xml'
              }
            }
          },
          { title: 'Does AI dream of Hexadecimal sheep?' },
          { link: 'oxbaa.herokuapp.com' },
          { description: 'A blog (mostly) for TalTech SPEAIT course' },
          { language: 'en-us' },
          ...posts.map((post) => {
            const absoluteHREF = 'https://oxbaa.herokuapp.com/' + post.id
            return {
              item: [
                {title: post.title},
                {pubDate: post.date},
                {link: absoluteHREF},
                {guid: absoluteHREF},
                {description: {_cdata: marked(post.content.substring(0,30))}},
                {content: {_cdata: marked(post.content)}}
              ]
            }
          })
        ]
      }
    ]
  }

  const xmlObject = xml(rssObject, {declaration: true, indent:true, indentchars: ' ', newlinechars:'\r\n'})
  response.set('Content-Type', 'application/rss+xml');
  response.send(xmlObject)
})

module.exports = rssRouter
