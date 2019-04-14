import React from 'react';

import { newAnecdote } from '../reducers/anecdoteReducer';

const AnecdoteForm = props => {
  const addNew = e => {
    e.preventDefault();
    const anecdote = e.target.newAnecdote.value;
    console.log('adding new', anecdote);

    props.store.dispatch(newAnecdote(anecdote));

    e.target.newAnecdote.value = '';
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
