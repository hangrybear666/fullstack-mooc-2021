import React from 'react';

const Header = ({ course }) => (
    <h3 style={{textDecoration:"underline"}}>{course.name}</h3>
)

const Total = ({ course }) => {
    const sum = course.parts.reduce((total, part) => total + part.exercises, 0)
    return <p style={{fontWeight: "bold"}}>total of {sum} exercises</p>
}

const Part = ({ part }) => (
    <p style={{fontFamily: "Consolas"}}> {part.name} {part.exercises} </p>
)

const Content = ({ course }) => (
    <div>
      {course.parts.map(part =>
        <Part key={part.id} part={part}/>
        )
      }
    </div>
)

const Course = ({course}) => (
    <div style={{marginBottom: "50px"}}>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
    </div>
)

export default Course