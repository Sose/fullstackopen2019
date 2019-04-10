import React, { useState } from 'react';

import blogService from '../services/blogs';

const AddBlogForm = ({ addNewBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    console.log('submitting new blog', title, author, url);

    try {
      const newBlog = {
        title, author, url
      };

      const response = await blogService.create(newBlog);
      addNewBlog(response);
    } catch (exception) {
      console.log('exception in handleBlogSubmit', exception);
    }
  };

  return (
    <form onSubmit={handleBlogSubmit}>
      <div>
        title
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default AddBlogForm;
