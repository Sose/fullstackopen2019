import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import personService from './services/persons';

const Notification = ({ notification }) => {
  const { message, type } = notification;

  if (message === null) {
    return null;
  }
  if (type === 'notification') {
    return <div className="notification">{message}</div>;
  } else if (type === 'error') {
    return <div className="error">{message}</div>;
  } else {
    console.log('Notification: wrong type', type, 'message was', message);
    return null;
  }
};

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
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

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

  const showNotification = (notification, length = 3000) => {
    setNotification(notification)
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, length)
  }

  const onDeleteClick = id => () => {
    console.log('deleteClick', id);
    const { name } = persons.find(p => p.id === id);
    const confirmation = window.confirm(`Poistetaanko ${name}?`);

    if (confirmation) {
      personService.remove(id).then(res => {
        let newPersons = [...persons];
        newPersons = newPersons.filter(p => p.name !== name);
        setPersons(newPersons);
        showNotification({
          message: `Poistettiin ${name}`,
          type: 'notification'
        }, 3000);
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
      const confirmation = window.confirm(
        `${found.name} on jo luettelossa, korvataanko numero uudella?`
      );
      if (confirmation) {
        personService.update(found.id, newPerson).then(res => {
          console.log('update res', res);
          let newPersons = [...persons];
          const { name, number, id } = res.data;
          const index = newPersons.indexOf(found);
          newPersons[index] = { name, number, id };
          setPersons(newPersons);
          setNewName('');
          setNewNumber('');
          showNotification({
            message: `Päivitettiin ${name}, uusi numero on ${number}`,
            type: 'notification'
          }, 3000)
        }).catch(error => {
          // the person to update has been deleted already
          showNotification({
            message: `Henkilö ${found.name} oli jo poistettu`,
            type: 'error'
          }, 3000)
          let newPersons = [...persons];
          newPersons = newPersons.filter(p => p.name !== found.name);
          setPersons(newPersons);
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
        showNotification({
          message: `Lisättiin ${name} numerolla ${number}`,
          type: 'notification'
        }, 3000);
      }).catch(err => {
        const errorMsg = err.response.data.error;
        showNotification({ message: errorMsg, type: 'error'}, 5000);
      })
    }
  };

  return (
    <div>
      <h2>Puhelinluettelo</h2>
      <Notification notification={notification} />
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
