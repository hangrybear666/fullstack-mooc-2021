import react from 'react'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <p className={type}>
      {message}
    </p>
  )
}

export default Notification