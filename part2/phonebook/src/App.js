import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PersonFilter from './components/PersonFilter'
import personService from './services/persons'
import './App.css'
import Notification from './components/Notification'


const App = () => {
  /**
   * State of the App is maintained here
   */
  const [nameFilter, setNameFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [persons, setPersons] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMsg, setNotificationMsg] = useState(null)

  const hook = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
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
    if (newName === '') {
      alert(`please provide a name`)
    }
    let namePresent = false
    let updateId
    persons.forEach(person => {
        if (person.name === newName.trim()) {
          namePresent = true
          updateId = person.id
        }
      }
    )
    if (namePresent) {
      /**
       * user is found in the db. update phone number.
       */
      const personToUpdate = persons.find(person => person.id === updateId)
      const updatedPerson = {...personToUpdate, number : newPhone.trim()}
      personService
        .update(updateId, updatedPerson)
        .then(updatedEntry => {
          setPersons(persons.map(person => person.id === updateId ? updatedEntry : person))
          const message = `The person with name: ${updatedEntry.name} has been updated!`
          notifyUser(message,false)
        }).catch(error => {
          const message = `The person with id ${updateId} cannot be found!`
          notifyUser(message, true)
        })
    } else {
      /**
       * new user is to be added to the db.
       */
      const newEntry =
        { name: newName.trim(),
          number: newPhone.trim(),
          id: persons.length + 1 }
      personService
        .create(newEntry)
        .then(addedPerson => {
          setPersons(persons.concat(addedPerson))
          const message = `The person with name:  ${addedPerson.name} has been inserted!`
          notifyUser(message, false)
        })
      setNameFilter('')
    }
  }

  const nameChangeListener = (e) => {
    setNewName(e.target.value)
  }

  const phoneChangeListener = (e) => {
    setNewPhone(e.target.value)
  }

  const filterChangeListener = (e) => {
    setNameFilter(e.target.value)
  }

  const deletePersonFromDb = (e) => {
    if (window.confirm("Confirm Deletion?")) {
      personService
        .deleteEntry(e.target.id)
        .then(status => {
          if (status === 200) {
              setPersons(persons.filter(person => person.id != e.target.id))
              setNameFilter('')
              const message = `The person with id ${e.target.id} has been deleted!`
              notifyUser(message, false)
          }
        }).catch(error => {
          const message = `The person with id ${e.target.id} has already been deleted!\nPlease reload the page`
          notifyUser(message, true)
        })
    }
  }

  /**
   * helper function for sending perishable notifications to the user
   * @param {string} message
   * @param {boolean} isError
   */
  const notifyUser = (message, isError) => {
    if (isError) {
      setErrorMessage(message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } else {
      setNotificationMsg(message)
      setTimeout(() => {
        setNotificationMsg(null)
      }, 5000)
    }
  }

  /** filter persons */
  const personsToShow = nameFilter.length === 0
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase().trim()))

  return (
    <>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type="error"/>
      <Notification message={notificationMsg} type="notification"/>
      <PersonFilter
        nameFilter={nameFilter}
        onFilter={filterChangeListener}
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
      <Persons persons={personsToShow}
                onClickDeleteFromDb={deletePersonFromDb}/>
    </>
  )
}

export default App