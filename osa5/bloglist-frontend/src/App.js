import React, { useState, useEffect } from 'react';

import Blog from './components/Blog';
import AddBlogForm from './components/AddBlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password);

    try {
      const user = await loginService.login({
        username, password,
      });
      
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      );

      setUser(user);
      setUsername('');
      setPassword('');
      blogService.setToken(user.token);
    } catch(exception) {
      showNotification({
        message: 'käyttäjätunnus tai salasana virheellinen',
        type: 'error'
      }, 5000);
    }
  };

  const logoutButtonClick = () => {
    setUser(null);
    window.localStorage.removeItem('loggedBlogUser');
  };

  const addNewBlog = (newBlog) => {
    // console.log('App: onNewBlog', newBlog);
    const newBlogs = [...blogs].concat(newBlog);
    setBlogs(newBlogs);
    showNotification({
      message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      type: 'notification'
    });
  };

  const updateBlogLikes = (newBlog) => {
    //console.log('App: updateBlogLikes', newBlog);

    const blogToUpdateIndex = blogs.findIndex(blog => blog.id === newBlog.id);
    const newBlogs = [...blogs];
    newBlogs[blogToUpdateIndex].likes = newBlog.likes;
    setBlogs(newBlogs);

  };

  const showNotification = (notification, length = 3000) => {
    setNotification(notification);
    setTimeout(() => {
      setNotification({ message: null, type: null });
    }, length);
  };

  // either show the login page or list the blogs
  const pageToShow = user === null ? (
    <div>
      <h2>Kirjaudu</h2>
      <Togglable buttonLabel='login'>
        <form onSubmit={handleLogin}>
          <div>
          käyttäjätunnus
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
          salasana
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">kirjaudu</button>
        </form>
      </Togglable>
    </div>
  ) : (
    <div>
      <div>{user.name} logged in</div>
      <button onClick={logoutButtonClick} >log out</button>
      <br />

      <AddBlogForm addNewBlog={addNewBlog} />

      {blogs.sort((b1, b2) => b2.likes - b1.likes).map(blog => (
        <Blog key={blog.id} blog={blog} updateBlogLikes={updateBlogLikes} />
      ))}
    </div>
  );

  return (
    <div>
      <h1>blogs</h1>

      <Notification notification={notification} />

      {pageToShow}
    </div>
  );
};

export default App;
