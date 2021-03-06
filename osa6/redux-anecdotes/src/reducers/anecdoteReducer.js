/* const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
]; */

import anecdoteService from '../services/anecdotes';

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = anecdote => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

/*const addVote = (id) => {
  return {
    type: 'VOTE',
    data: {
      id
    }
  };
};*/

const addVote = (anecdote) => {
  return async (dispatch) => {
    const voted = await anecdoteService.voteFor(anecdote);
    console.log('voted', voted);
    dispatch({
      type: 'VOTE',
      data: {
        id: anecdote.id
      }
    });
  };
};

const newAnecdote = (anecdote) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(anecdote);
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    });
  };
};

const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    });
  };
};

//const initialState = anecdotesAtStart.map(asObject);

const reducer = (state = [], action) => {
  console.log('state now: ', state);
  console.log('action', action);

  switch (action.type) {
  case 'VOTE': {
    const newState = state.map(anecdote =>
      anecdote.id === action.data.id
        ? { ...anecdote, votes: anecdote.votes + 1 }
        : anecdote
    );
    return newState;
  }
  case 'NEW_ANECDOTE': {
    const newState = state.concat(asObject(action.data.content));
    return newState;
  }
  case 'INIT_ANECDOTES': {
    return action.data;
  }
  default:
    return state;
  }
};

export default reducer;
export { addVote, newAnecdote, initializeAnecdotes };
