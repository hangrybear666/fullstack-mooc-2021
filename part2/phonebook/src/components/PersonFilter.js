import React from 'react';

const PersonFilter = (props) => {

    return (
        <div style={{marginBottom: "20px",whiteSpace:"pre"}}>
            filter by name: <input  value={props.nameFilter}
                                    onChange={props.onFilter}/>
        </div>
    )
}

export default PersonFilter