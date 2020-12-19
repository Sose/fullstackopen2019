const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { initialBlogs, blogsInDb } = require('./test_helper')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.create(initialBlogs)
})

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are six blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(6)
  })

  /*
  // does Mongo even guarantee the order of documents?
  test('the first blog is about React patterns', async () => {
    const response = await api.get('/api/blogs');
    
    expect(response.body[0].title).toBe('React patterns');
  });
  */

  test('the identifying field is called id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('POST /api/blogs', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Joku blogi',
      author: 'Matti Meikäläinen',
      url: 'http://joku.hieno.url',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map((r) => r.title)

    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(titles).toContain('Joku blogi')
  })

  test('if likes field is empty, it is set to 0', async () => {
    const newBlog = {
      title: 'Joku blogi',
      author: 'Matti Meikäläinen',
      url: 'http://joku.hieno.url',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    let addedBlog = await Blog.find(newBlog)

    expect(addedBlog.length).toBe(1)

    //console.log('addedBlog', addedBlog[0]);

    expect(addedBlog[0].likes).toBe(0)
  })

  test('adding a blog without title fails', async () => {
    const newBlog = {
      url: 'http://jotain',
      author: 'Testi Testaaja',
      likes: 13,
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })

  test('adding a blog without url fails', async () => {
    const newBlog = {
      title: 'Hieno title',
      author: 'Testi Testaaja',
      likes: 13,
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

describe('DELETE /api/blogs', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd.length).toBe(initialBlogs.length - 1)

    const titles = blogsAtEnd.map((r) => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('PUT /api/blogs (update)', () => {
  test('updating likes works', async () => {
    const newBlog = {
      title: 'Joku blogi',
      author: 'Matti Meikäläinen',
      url: 'http://joku.hieno.url',
      likes: 5,
    }

    const blog = new Blog(newBlog)
    await blog.save()

    const res = await api
      .put(`/api/blogs/${blog._id}`)
      .send({ likes: blog.likes + 5 })
      .expect(200)

    expect(res.body.likes).toBe(blog.likes + 5)

    const updatedBlogInDb = await Blog.findById(blog._id)

    expect(updatedBlogInDb.likes).toBe(blog.likes + 5)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
