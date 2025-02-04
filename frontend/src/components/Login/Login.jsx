import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Box } from "@mui/material"
import { useAuth } from "../../hooks/useAuth"
import "./Login.css"

export const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/site/songs")
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch("api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      if (response.ok) {
        setMessage(data.message)
        login()
        navigate("/site/songs")
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    }
  }

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "5%",
      }}
    >
      <div className={"container"}>
        <form id="login-form" onSubmit={handleSubmit}>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button id="login-button" type="submit">
            Login
          </button>
        </form>
        <p>{message}</p>
      </div>
    </Box>
  )
}

export default Login

