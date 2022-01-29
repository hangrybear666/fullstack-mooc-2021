import React from 'react';

const PersonForm = (props) => (
    <form onSubmit={props.onSubmit}>
        <div style={{whiteSpace:"pre"}}>
            name:  <input  value={props.newName}
                        onChange={props.onNameChange}/>
        </div>
        <div>
            phone:  <input  value={props.newPhone}
                        onChange={props.onPhoneChange}/>
        </div>
        <div>
            <button type="submit" >add</button>
        </div>
    </form>
)

export default PersonForm