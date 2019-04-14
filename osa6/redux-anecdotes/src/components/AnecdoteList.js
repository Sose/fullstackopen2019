import React from 'react';

import { addVote } from '../reducers/anecdoteReducer';

const AnecdoteList = props => {
  const anecdotes = props.store.getState();

  const vote = id => {
    console.log('vote', id);
    props.store.dispatch(addVote(id));
  };

  return (
    <div>
      {anecdotes
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
