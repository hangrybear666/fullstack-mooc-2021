const Logout = ({ user ,handleLogout }) => {
  if (user !== null) {
    return (
      <div style={{ marginTop:15 }}>
        <i>Logged in as</i> <b>{user.name}</b>
        <button onClick={handleLogout}>
          logout
        </button>
      </div>
    )
  } else {
    return (
      <>
      </>
    )
  }
}

export default Logout