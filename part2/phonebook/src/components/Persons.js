import React from 'react';

const Persons = ({persons, onClickDeleteFromDb}) => (
<ul>
    {persons.map(person =>
        <li key={person.name}>{person.name} {person.number}
            <button className="btn-delete" id={person.id} onClick={onClickDeleteFromDb}>delete</button>
        </li>
        )
    }
</ul>)

export default Persons