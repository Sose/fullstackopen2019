import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Header = ({ text }) => (
  <div>
    <h1>{text}</h1>
  </div>
);

const Button = ({ onClick, text }) => {
  return (
    <div>
      <button onClick={onClick}>{text}</button>
    </div>
  );
};

const Statistic = ({ name, value }) => (
  <tr>
    <td>{name}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  const totalVotes = good + neutral + bad;
  const totalValue = good - bad;
  const average = totalValue / totalVotes;
  const positivePercent = Math.round((good / totalVotes) * 1000) / 10;

  if (totalVotes < 1) {
    return <div>Ei yhtään palautetta annettu</div>;
  }

  return (
    <div>
      <table>
        <tbody>
          <Statistic name="hyvä" value={good} />
          <Statistic name="neutraali" value={neutral} />
          <Statistic name="huono" value={bad} />
          <Statistic name="yhteensä" value={totalVotes} />
          <Statistic name="keskiarvo" value={average} />
          <Statistic name="positiivisia" value={positivePercent + ' %'} />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const addGood = () => {
    setGood(good + 1);
  };

  const addNeutral = () => {
    setNeutral(neutral + 1);
  };

  const addBad = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <Header text="anna palautetta" />
      <div id="napit">
        <Button text="hyvä" onClick={addGood} />
        <Button text="neutraali" onClick={addNeutral} />
        <Button text="huono" onClick={addBad} />
      </div>
      <Header text="statistiikka" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
