import React from 'react';

import { newAnecdote } from '../reducers/anecdoteReducer';
import { showNotification, hideNotification } from '../reducers/notificationReducer';

const AnecdoteForm = props => {
  const addNew = e => {
    e.preventDefault();
    const anecdote = e.target.newAnecdote.value;
    console.log('adding new', anecdote);

    props.store.dispatch(newAnecdote(anecdote));

    e.target.newAnecdote.value = '';
    props.store.dispatch(showNotification(`added new anecdote ${anecdote}`));
    setTimeout(() => { props.store.dispatch(hideNotification()); }, 5000);
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addNew}>
        <div>
          <input name="newAnecdote" />
        </div>
        <button>create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
