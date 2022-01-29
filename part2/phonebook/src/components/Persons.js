import React from 'react';

const Persons = ({persons}) => (
<ul>
    {persons.map(person =>
        <li key={person.name}>{person.name} {person.phone}</li>
        )
    }
</ul>)

export default Persons