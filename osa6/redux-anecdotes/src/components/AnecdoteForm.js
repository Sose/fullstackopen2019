import React from 'react';
import { connect } from 'react-redux';

import { newAnecdote } from '../reducers/anecdoteReducer';
import { showNotification } from '../reducers/notificationReducer';

const AnecdoteForm = props => {
  const addNew = async (e) => {
    e.preventDefault();
    const anecdote = e.target.newAnecdote.value;
    console.log('adding new', anecdote);
    e.target.newAnecdote.value = '';

    props.newAnecdote(anecdote);

    props.showNotification(`added new anecdote ${anecdote}`, 5);
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

const mapStateToProps = (state) => {
  return {
    
  };
};

const mapDispatchToProps = {
  newAnecdote, showNotification
};

const ConnectedAnecdoteForm = connect(mapStateToProps, mapDispatchToProps)(AnecdoteForm);

export default ConnectedAnecdoteForm;
