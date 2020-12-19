const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const token = request.token

  //console.log('POST BLOG', body, token);

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (exception) {
    console.log('exception when saving blog', exception)
    next(exception)
  }

  /*
  blog
    .save()
    .then(result => {
      response.status(201).json(result);
    })
    .catch(error => {
      if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message });
      }
    });
    */
})

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === decodedToken.id) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { author, title, url, likes } = request.body

  const blog = {
    author,
    title,
    url,
    likes,
  }

  const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })

  response.json(updatedNote.toJSON())
})

module.exports = blogsRouter
