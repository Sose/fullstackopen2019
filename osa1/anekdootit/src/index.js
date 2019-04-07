import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Button = ({ text, onClick }) => (
  <div>
    <button onClick={onClick}>{text}</button>
  </div>
);

const BestAnecdote = ({ anecdotes, votes }) => {
  const mostVotes = Math.max(...votes);
  const bestIndex = votes.indexOf(mostVotes)
  const bestAnecdote = anecdotes[bestIndex]
  
  return (
    <div>
      <p>{bestAnecdote}</p>
      <p>has {mostVotes} votes</p>
    </div>
  )
}

const App = props => {
  const [selected, setSelected] = useState(0);
  // all votes start at 0
  const initialVotes = Array.from({ length: props.anecdotes.length }, _ => 0);
  const [votes, setVotes] = useState(initialVotes);

  const voteAnecdote = selected => () => {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  };

  const randomAnecdote = () => {
    const max = props.anecdotes.length;

    //let's ensure we don't get the same anecdote twice in a row
    let randomId;
    do {
      randomId = Math.floor(Math.random() * max);
    } while (randomId === selected);

    setSelected(randomId);
  };

  return (
    <div>
    <h1>Anecdote of the day</h1>
      <p>{props.anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button text="vote" onClick={voteAnecdote(selected)} />
      <Button text="next anecdote" onClick={randomAnecdote} />
      <h1>Anecdote with most votes</h1>
      <BestAnecdote anecdotes={props.anecdotes} votes={votes} />
    </div>
  );
};

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById('root'));
