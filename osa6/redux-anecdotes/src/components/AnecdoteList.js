import React from 'react';
import { connect } from 'react-redux';

import { addVote } from '../reducers/anecdoteReducer';
import { showNotification } from '../reducers/notificationReducer';

const AnecdoteList = props => {
  const { visibleAnecdotes } = props;

  const vote = anecdote => {
    const { id } = anecdote;

    console.log('vote', id);
    props.addVote(anecdote);

    const votedAnecdote = visibleAnecdotes.find(a => a.id === id);
    props.showNotification(`voted for ${votedAnecdote.content}`, 5);
  };

  return (
    <div>
      {visibleAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const anecdotesToShow = ({ anecdotes, filter }) => {
  return anecdotes
    .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
    .sort((a1, a2) => a2.votes - a1.votes);
};

const mapStateToProps = state => {
  return {
    visibleAnecdotes: anecdotesToShow(state),
  };
};

const mapDispatchToProps = {
  addVote,
  showNotification,
};

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList);

export default ConnectedAnecdoteList;
