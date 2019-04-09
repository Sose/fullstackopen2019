const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

const blogsRouter = require('express').Router();

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body;

  const token = request.token;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }

    const user = await User.findById(body.userId);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
  } catch (exception) {
    //console.log('exception when saving blog', exception);
    next(exception);
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
});

blogsRouter.delete('/:id', async (request, response, next) => {
  const body = request.body;
  
  const token = request.token;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }

    const user = await User.findById(body.userId);
    const blog = await Blog.findById(body.id);

    if (blog.user.toString() !== body.userId.toString()) {
      return response.status(401).end();
    }

    await blog.delete();

  } catch(exception) {
    next(exception);
  }
  
  /*
  Blog.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      console.log('error while deleting', err);
    });
  */
});

blogsRouter.put('/:id', (req, res) => {
  const body = req.body;
  const id = req.params.id;

  const updatedPerson = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
  };

  Blog.findByIdAndUpdate(id, updatedPerson, { new: true })
    .then(updatedBlog => {
      const purkkaa = new Blog(updatedBlog).toJSON();
      res.status(200).json(purkkaa);
    })
    .catch(err => {
      console.log('error in findByIdAndUpdate', err);
      res.status(400).send({ err });
    });
});

module.exports = blogsRouter;
