const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs);
  });
});

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body);

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
});

blogsRouter.delete('/:id', (req, res) => {
  Blog.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      console.log('error while deleting', err);
    });
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
