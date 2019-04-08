const _ = require('lodash');

const dummy = blogs => {
  return 1;
};

const totalLikes = blogs =>
  blogs.reduce((total, blog) => total + blog.likes, 0);

const favoriteBlog = blogs => {
  return blogs.reduce((currentBest, blog) => {
    if (!currentBest) return blog;

    if (currentBest.likes < blog.likes) return blog;
    else return currentBest;
  }, undefined);
};

// Given an array of blogs, returns an object with fields
// { author1: numOfBlogs, author2: numOfBlogs } etc
const blogsByAuthor = blogs => {
  const names = blogs.map(b => b.author);

  const blogsBy = names.reduce((obj, name) => {
    if (!obj[name]) {
      return { ...obj, [name]: 1 };
    }
    return { ...obj, [name]: obj[name] + 1 };
  }, {});

  return blogsBy;
};

// Returns the author with most blogs
// format: { author: String, blogs: Number }
const mostBlogs = blogs => {
  if (!Array.isArray(blogs) || blogs.length === 0) return undefined;

  const byAuthor = blogsByAuthor(blogs);
  const most = Object.entries(byAuthor).reduce(
    (best, current) => {
      const [author, numBlogs] = current;
      return numBlogs > best.blogs ? { author, blogs: numBlogs } : best;
    },
    { author: '', blogs: -1 }
  );

  return most;
};

// Returns the author whose blogs have the highest likes in total
// format: { author: String, likes: Number }
const mostLikes = blogs => {
  const likesByAuthor = blogs.reduce((o, blog) => {
    const { author, likes } = blog;

    if (!o[author]) {
      return { ...o, [author]: likes };
    }

    return { ...o, [author]: o[author] + likes };
  }, {});

  const most = Object.entries(likesByAuthor).reduce(
    (best, cur) => {
      const [author, likes] = cur;

      if (likes > best.likes) {
        return { author, likes };
      }

      return best;
    },
    { author: '', likes: -1 }
  );

  return most;
};

const blogsByAuthor_ = blogs => _.countBy(blogs, blog => blog.author);

const mostBlogs_ = blogs => {
  if (!Array.isArray(blogs) || blogs.length === 0) return undefined;

  const byAuthor = blogsByAuthor_(blogs);

  //pairs will be like [author, blogs]
  const pairs = _.toPairs(byAuthor);
  const most = _.orderBy(pairs, [pair => pair[1]], ['desc'])[0];
  return {
    author: most[0],
    blogs: most[1],
  };
};

const mostLikes_ = blogs => {
  const likesByAuthor = _.reduce(
    blogs,
    (o, current) => {
      const { author, likes } = current;

      if (!o[author]) {
        return { ...o, [author]: likes };
      }
      return { ...o, [author]: o[author] + likes };
    },
    {}
  );

  const pairs = _.toPairs(likesByAuthor);
  const most = _.orderBy(pairs, [pair => pair[1]], ['desc'])[0];

  return {
    author: most[0],
    likes: most[1],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  mostBlogs_,
  mostLikes_,
};
