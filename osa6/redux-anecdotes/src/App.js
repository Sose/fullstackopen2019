import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import anecdoteService from './services/anecdotes';
import { initializeAnecdotes } from './reducers/anecdoteReducer';

import AnecdoteList from './components/AnecdoteList';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import Filter from './components/Filter';

const App = (props) => {
  useEffect(() => {
    props.initializeAnecdotes();
  }, []);

  return (
    <div>
      <Notification />
      <h1>Programming anecdotes</h1>
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default connect(null, { initializeAnecdotes })(App);
