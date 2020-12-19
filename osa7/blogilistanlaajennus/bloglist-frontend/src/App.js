import React, { useState, useEffect } from 'react'

import { useField } from './hooks'

import Blog from './components/Blog'
import AddBlogForm from './components/AddBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [notification, setNotification] = useState({
    message: null,
    type: null,
  })

  const [user, setUser] = useState(null)
  const username = useField('text')
  const password = useField('password')

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  })

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username.value, password.value)

    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value,
      })

      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))

      setUser(user)
      username.reset()
      password.reset()
      blogService.setToken(user.token)
    } catch (exception) {
      showNotification(
        {
          message: 'käyttäjätunnus tai salasana virheellinen',
          type: 'error',
        },
        5000
      )
    }
  }

  const logoutButtonClick = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogUser')
  }

  const addNewBlog = (newBlog) => {
    // console.log('App: onNewBlog', newBlog);
    const newBlogs = [...blogs].concat(newBlog)
    setBlogs(newBlogs)
    showNotification({
      message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      type: 'notification',
    })
  }

  const updateBlogLikes = async (blog) => {
    //console.log('App: updateBlogLikes', blog);
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    const response = await blogService.update(updatedBlog)
    const blogToUpdateIndex = blogs.findIndex((blog) => blog.id === response.id)
    const newBlogs = [...blogs]
    newBlogs[blogToUpdateIndex].likes = response.likes
    setBlogs(newBlogs)
  }

  const removeBlog = async ({ id, title }) => {
    const response = await blogService.remove({ id })
    console.log('removed', response)
    const newBlogs = blogs.filter((blog) => blog.id !== id)
    console.log('newBlogs', newBlogs)
    setBlogs(newBlogs)
    showNotification(
      {
        message: `removed blog ${title}`,
        type: 'notification',
      },
      3000
    )
  }

  const showNotification = (notification, length = 3000) => {
    setNotification(notification)
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, length)
  }

  // either show the login page or list the blogs
  const pageToShow =
    user === null ? (
      <div>
        <h2>Kirjaudu</h2>
        <Togglable buttonLabel="login">
          <form onSubmit={handleLogin}>
            <div>
              käyttäjätunnus
              <input {...username} reset={undefined} />
            </div>
            <div>
              salasana
              <input {...password} reset={undefined} />
            </div>
            <button type="submit">kirjaudu</button>
          </form>
        </Togglable>
      </div>
    ) : (
      <div>
        <div>{user.name} logged in</div>
        <button onClick={logoutButtonClick}>log out</button>
        <br />

        <AddBlogForm addNewBlog={addNewBlog} />

        {blogs
          .sort((b1, b2) => b2.likes - b1.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              updateBlogLikes={updateBlogLikes}
              removeBlog={removeBlog}
            />
          ))}
      </div>
    )

  return (
    <div>
      <h1>blogs</h1>

      <Notification notification={notification} />

      {pageToShow}
    </div>
  )
}

export default App
