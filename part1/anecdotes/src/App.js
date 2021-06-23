import React, { useState } from 'react'
const Header = (props) => (
  <h2>{props.text}</h2>
)
const Btn = (props) => (
  <button onClick={props.handleClick} onMouseDown={props.onmousedown} onMouseUp={props.onmouseup}>{props.text}</button>
)
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blod tests when dianosing patients'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState([])
  const [maxIndex, setMaxIndex] = useState(0)

  if (votes[0] === undefined) {
    setVotes(new Array(7).fill(0))
  }
  
  const processClick = () => {
    const d7 = Math.floor(Math.random() * 7)
    setSelected(d7)
    return selected
  }

  const vote = (value) => {
    const newVotes = [...votes]
    newVotes[value] += 1
    setVotes(newVotes)
  }

  const updateMax = () => {
    let currentMax = 0
    let index = 0

    votes.forEach(vote => {
      if (currentMax < vote) {
        currentMax = vote
        setMaxIndex(index)
      }
      index++
    });
  }

  return (
    <div>
      <Header text="Anecdote of the day"/>
      <p>
        {anecdotes[selected]}
      </p>
      <p>has {votes[selected]} votes</p>
      <Btn handleClick={() => processClick()} text="next anecdote"/>
      <Btn onmousedown={() => vote(selected)} onmouseup={() => updateMax()} text="vote"/>
      <Header text="Anecdote with most votes"/>
      <p>
        {anecdotes[maxIndex]}
      </p>
      <p>has {votes[maxIndex]} votes</p>
    </div>
  )
}

export default App