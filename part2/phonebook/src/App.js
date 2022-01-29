import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
  const [persons, setPersons] = useState([])
  const [filteredPersons, setfilteredPersons] = useState(persons)

  const hook = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
        setfilteredPersons(response.data)
      })
  }
  useEffect(hook, [])

  /**
   * is called once the add button is clicked.
   * if name is already in the persons array, displays alert
   * if name to be added is an empty string, displays alert
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
    if (newName === '') {
      alert(`please provide a name`)
    } else if (namePresent) {
      alert(`${newName} is already in the list`)
    } else {
      const newEntry =  [
        { name: newName,
          number: newPhone,
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