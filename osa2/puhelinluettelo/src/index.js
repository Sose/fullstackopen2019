import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import personService from './services/persons';

const Person = ({ person }) => (
  <div>
    {person.name} {person.number}
  </div>
);

const FilteredPersons = ({ persons, filter, onDeleteClick }) => {
  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {personsToShow.map(p => (
        <div key={p.id}>
          <Person person={p} />
          <button onClick={onDeleteClick(p.id)}>poista</button>
        </div>
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
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState('');
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  useEffect(() => {
    personService.getAll().then(res => {
      console.log('promise fulfilled', res);
      setPersons(res.data);
    });
  }, []);

  const handleNameChange = e => {
    setNewName(e.target.value);
  };

  const handleNumberChange = e => {
    setNewNumber(e.target.value);
  };

  const handleFilterChange = e => {
    setFilter(e.target.value);
  };

  const onDeleteClick = id => () => {
    console.log('deleteClick', id);
    const { name } = persons.find(p => p.id === id);
    const confirmation = window.confirm(`Poistetaanko ${name}?`);

    if (confirmation) {
      personService.remove(id).then(res => {
        let newPersons = [...persons];
        newPersons = newPersons.filter(p => p.name !== name);
        setPersons(newPersons);
      });
    }
  };

  const addPerson = e => {
    e.preventDefault();

    // if there's no name given, abort
    if (newName === '') return;

    const newPerson = { name: newName, number: newNumber };

    const found = persons.find(person => person.name === newName);
    if (found) {
      // update existing person
      const confirmation = window.confirm(`${found.name} on jo luettelossa, korvataanko numero uudella?`);
      if (confirmation) {
        personService
          .update(found.id, newPerson)
          .then(res => {
            console.log('update res', res)
            let newPersons = [...persons];
            const { name, number, id } = res.data;
            const index = newPersons.indexOf(found);
            newPersons[index] = { name, number, id }
            setPersons(newPersons)
            setNewName('')
            setNewNumber('')
          })
      }
    } else {
      // add a new person
      personService.create(newPerson).then(res => {
        let newPersons = [...persons];
        const { name, number, id } = res.data;
        newPersons.push({ name, number, id });
        setPersons(newPersons);
        setNewName('');
        setNewNumber('');
      });
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
      <FilteredPersons
        persons={persons}
        filter={filter}
        onDeleteClick={onDeleteClick}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
