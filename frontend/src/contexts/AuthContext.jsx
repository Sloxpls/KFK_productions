import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = sessionStorage.getItem("logged_in")
      setIsAuthenticated(!!loggedIn)
    }

    checkAuthStatus()
    window.addEventListener("storage", checkAuthStatus)

    return () => {
      window.removeEventListener("storage", checkAuthStatus)
    }
  }, [])

  const login = () => {
    sessionStorage.setItem("logged_in", "true")
    setIsAuthenticated(true)
  }

  const logout = () => {
    sessionStorage.removeItem("logged_in")
    setIsAuthenticated(false)
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

