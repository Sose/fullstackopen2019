import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Person = ({ person }) => (
  <div>
    {person.name} {person.number}
  </div>
);

const FilteredPersons = ({ persons, filter }) => {
  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {personsToShow.map(p => (
        <Person key={p.name} person={p} />
      ))}
    </div>
  );
};

const InputForm = ({ filter, handleFilterChange }) => (
  <p>
    Rajaa näytettäviä
    <input value={filter} onChange={handleFilterChange} />
  </p>
);

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => (
  <form onSubmit={addPerson}>
    <div>
      nimi: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      numero: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">lisää</button>
    </div>
  </form>
);

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Martti Tienari', number: '040-123456' },
    { name: 'Arto Järvinen', number: '040-123456' },
    { name: 'Lea Kutvonen', number: '040-123456' },
  ]);
  const [filter, setFilter] = useState('');
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  const handleNameChange = e => {
    setNewName(e.target.value);
  };

  const handleNumberChange = e => {
    setNewNumber(e.target.value);
  };

  const handleFilterChange = e => {
    setFilter(e.target.value);
  };

  const addPerson = e => {
    e.preventDefault();
    if (newName === '') return;

    // does the name already exist?
    const found = persons.find(person => person.name === newName);
    if (found) {
      alert(`${newName} on jo luettelossa`);
      console.log(`person ${newName} already exists, aborting`);
    } else {
      let newPersons = [...persons];
      newPersons.push({ name: newName, number: newNumber });
      setPersons(newPersons);
      setNewName('');
      setNewNumber('');

      console.log(`added person ${newName} with number ${newNumber}`);
    }
  };

  return (
    <div>
      <h2>Puhelinluettelo</h2>

      <InputForm filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Lisää uusi</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numerot</h3>
      <FilteredPersons persons={persons} filter={filter} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
