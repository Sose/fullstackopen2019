import React from 'react';

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

const Content = ({ course }) => {
  const { parts } = course;

  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part.name} exercises={part.exercises} />
      ))}
    </div>
  );
};

const Total = ({ course }) => {
  const { parts } = course;

  const total = parts.reduce((total, part) => total + part.exercises, 0);

  return <p>yhteensä {total} tehtävää</p>;
};

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  );
};

export default Course;
