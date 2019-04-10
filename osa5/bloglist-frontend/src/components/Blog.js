import React, { useState } from 'react';

import blogService from '../services/blogs';

const Blog = ({ blog, updateBlogLikes }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };
  
  const [showAll, setShowAll] = useState(false);

  const onBlogTitleClick = () => {
    setShowAll(!showAll);
  };

  const onLikeClick = async () => {
    const updatedBlog = {...blog, likes: blog.likes + 1};
    const response = await blogService.update(updatedBlog);
    updateBlogLikes(response);
  };

  if (showAll) {
    return (
      <div style={blogStyle}>
        <div onClick={onBlogTitleClick}>
          {blog.title} by {blog.author} 
        </div>
        <a href={blog.url}>{blog.url}</a>
        <div>{blog.likes} likes <button onClick={onLikeClick}>like</button></div>
        { blog.user ? <div>added by {blog.user.name}</div> : null }
      </div>
    );
  } else {
    return (
      <div onClick={onBlogTitleClick}>
        {blog.title}
      </div>
    );
  }

};

export default Blog;
