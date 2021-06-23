import React, { useState } from 'react'

const Header = (props) => (
  <h2>{props.text}</h2>
)

const Statistics = (props) => {
  if (props.rendered === true) {
    return (
    <div>
      <table>
        <tbody>
          <Statistic description="good" value={props.good}/>
          <Statistic description="neutral" value={props.neutral}/>
          <Statistic description="bad" value={props.bad}/>
          <Statistic description="all" value={props.all}/>
          <Statistic description="average" value={props.avg}/>
          <Statistic description="positive" value={props.positivity}/>
        </tbody>
      </table>
    </div>
    )
  } else {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
}

const Statistic = (props) => (
  <tr>
    <td>
      {props.description}
    </td>
    <td>
      {props.value}
    </td> 
  </tr>
)

const Btn = (props) => (
    <button onClick={props.handleClick} >{props.text}</button>
)


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [positivity, setPositivity] = useState(0)
  const [isInitialized, setInitialized] = useState(false)

  
  const processClick = (type, value) => {
    if (type === "good") {
      setGood(good + 1)
    } else if (type === "neutral") {
      setNeutral(neutral + 1)
    } else if (type === "bad") {
      setBad(bad + 1)
    } 
    if (isInitialized === false) {
      setInitialized(true)
    }
    setAll(all + 1)
    setPositivity(positivity + value)
  }
    return (
      <div>
        <Header text="give feedback"/>
        <Btn handleClick={() => processClick("good", 1)} text="good"/>
        <Btn handleClick={() => processClick("neutral", 0)} text="neutral"/>
        <Btn handleClick={() => processClick("bad", -1)} text="bad"/>
        <Header text="statistics"/>
        <Statistics rendered={isInitialized} description="good" good={good} neutral={neutral} bad={bad} all={all} avg={positivity/all} positivity={good/all}/>
      </div>
    )
}

export default App