import { createContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { profileServices, logoutServices } from '../../services/auth.services'

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>
  login: () => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  const login = async () => {
    const user = await profileServices()
    setIsAuthenticated(true);
    setUser(user);
  }

  const logout = async () => {
    await logoutServices()
    setIsAuthenticated(false);
    setUser(undefined);
  }

  useEffect(() => {
    login()
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
