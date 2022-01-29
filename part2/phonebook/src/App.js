import React, { useState } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PersonFilter from './components/PersonFilter'

const App = () => {
  /**
   * State of the App is maintained here
   */
  const [nameFilter, setNameFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phone: '040-123456', id: 1 },
    { name: 'Ada Lovelace', phone: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', phone: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', phone: '39-23-6423122', id: 4 },
    { name: 'Abra Nemesis', phone: '49-0160-91341023', id: 5 }
  ])
  const [filteredPersons, setfilteredPersons] = useState(persons)

  /**
   * is called once the add button is clicked and
   * checks duplicate entry before submission to the person array
   * @param {event} e
   */
  const processSubmit = (e) => {
    e.preventDefault();
    let namePresent = false
    persons.forEach(person => {
        if (person.name === newName) {
          namePresent = true
        }
      }
    )
    if (namePresent) {
      alert(`${newName} is already in the list`)
    } else {
      const newEntry =  [
        { name: newName,
          phone: newPhone,
          id: persons.length + 1 }
      ]
      setPersons(persons.concat(newEntry))
      // Reset Filter after addition
      setfilteredPersons(persons.concat(newEntry))
      setNameFilter('')
    }
  }

  const nameChangeListener = (e) => {
    setNewName(e.target.value)
  }

  const phoneChangeListener = (e) => {
    setNewPhone(e.target.value)
  }

  /**
   * Checks whether or not the input text is included in the persons array and updates the filtered Array to match
   * @param {event} e
   */
  const filterPersonByName = (e) => {
    setNameFilter(e.target.value)
    setfilteredPersons(
      persons.filter(person =>
        person.name.toLowerCase().includes(
          e.target.value.toLowerCase().trim()
          )
      )
    )
  }

  return (
    <>
      <h2>Phonebook</h2>
      <PersonFilter
        nameFilter={nameFilter}
        onFilter={filterPersonByName}
      />

      <h2>add a new Person</h2>
      <PersonForm
        newName={newName}
        newPhone={newPhone}
        onNameChange={nameChangeListener}
        onPhoneChange={phoneChangeListener}
        onSubmit={processSubmit}
      />

      <h2>Numbers</h2>
      <Persons persons={filteredPersons}/>
    </>
  )
}

export default App