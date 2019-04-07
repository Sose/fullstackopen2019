import React from 'react';
import ReactDOM from 'react-dom';

const Header = props => (
  <div>
    <h1>{props.course.name}</h1>
  </div>
);

const Part = props => (
  <div>
    <p>
      {props.part} {props.exercises}
    </p>
  </div>
);

const Content = props => {
  const { course } = props;
  const { parts } = course;

  return (
    <div>
      <Part part={parts[0].name} exercises={parts[0].exercises} />
      <Part part={parts[1].name} exercises={parts[1].exercises} />
      <Part part={parts[2].name} exercises={parts[2].exercises} />
    </div>
  );
};

const Total = props => {
  const { course } = props;
  const { parts } = course;

  return (
    <p>
      yhteensä {parts[0].exercises + parts[1].exercises + parts[2].exercises}{' '}
      tehtävää
    </p>
  );
};

const App = () => {
  const course = {
    name: 'Half Stack -sovelluskehitys',
    parts: [
      {
        name: 'Reactin perusteet',
        exercises: 10,
      },
      {
        name: 'Tiedonvälitys propseilla',
        exercises: 7,
      },
      {
        name: 'Komponenttien tila',
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
