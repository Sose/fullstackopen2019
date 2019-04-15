import React from 'react';

import { addVote } from '../reducers/anecdoteReducer';
import { showNotification, hideNotification } from '../reducers/notificationReducer';

const AnecdoteList = props => {
  const anecdotes = props.store.getState().anecdotes;
  const filter = props.store.getState().filter;

  const vote = id => {
    console.log('vote', id);
    props.store.dispatch(addVote(id));

    const votedAnecdote = anecdotes.find(a => a.id === id);
    props.store.dispatch(showNotification(`voted for ${votedAnecdote.content}`));
    setTimeout(() => { props.store.dispatch(hideNotification()); }, 5000);
  };

  return (
    <div>
      {anecdotes
        .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
        .sort((a1, a2) => a2.votes - a1.votes)
        .map(anecdote => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdoteList;
