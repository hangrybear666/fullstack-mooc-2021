import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PersonFilter from './components/PersonFilter'
import personService from './services/persons'
import './App.css'


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
   * if name is already in the persons array, update its phone number 
   * if name to be added is an empty string, displays alert
   * @param {event} e
   */
  const processSubmit = (e) => {
    e.preventDefault();
    let namePresent = false
    let updateId
    persons.forEach(person => {
        if (person.name === newName.trim()) {
          namePresent = true
          updateId = person.id
        }
      }
    )
    if (newName === '') {
      alert(`please provide a name`)
    } else if (namePresent) {
      const personToUpdate = persons.find(person => person.id === updateId)
      const updatedPerson = {...personToUpdate, number : newPhone.trim()}
      personService
        .update(updateId, updatedPerson)
        .then(updatedEntry => {
          setPersons(persons.map(person => person.id === updateId ? updatedEntry : person))
          setfilteredPersons(filteredPersons.map(person => person.id === updateId ? updatedEntry : person))
        })
    } else {
      const newEntry =
        { name: newName.trim(),
          number: newPhone.trim(),
          id: persons.length + 1 }
      // persist to db.json
      personService
        .create(newEntry)
        .then(addedPerson => {
          setPersons(persons.concat(addedPerson))
          setfilteredPersons(persons.concat(addedPerson))
        })
      // Reset Filter after addition
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

  const deletePersonFromDb = (e) => {
    if (window.confirm("Confirm Deletion?")) {
      personService
        .deleteEntry(e.target.id)
        .then(status => {
          if (status === 200) {
              setPersons(persons.filter(person => person.id != e.target.id))
              setfilteredPersons(filteredPersons.filter(person => person.id != e.target.id))
              setNameFilter('')
          }
        })
    }
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
      <Persons persons={filteredPersons}
                onClickDeleteFromDb={deletePersonFromDb}/>
    </>
  )
}

export default App