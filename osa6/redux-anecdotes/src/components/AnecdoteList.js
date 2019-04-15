import React from 'react';
import { connect } from 'react-redux';

import { addVote } from '../reducers/anecdoteReducer';
import {
  showNotification,
  hideNotification,
} from '../reducers/notificationReducer';

const AnecdoteList = props => {
  const { visibleAnecdotes } = props;

  const vote = id => {
    console.log('vote', id);
    props.addVote(id);

    const votedAnecdote = visibleAnecdotes.find(a => a.id === id);
    props.showNotification(`voted for ${votedAnecdote.content}`);
    setTimeout(() => {
      props.hideNotification();
    }, 5000);
  };

  return (
    <div>
      {visibleAnecdotes.map(anecdote => (
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
  hideNotification,
};

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList);

export default ConnectedAnecdoteList;
