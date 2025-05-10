import axios from "axios"

export const loginServices = async (username: string, password: string, loginOrRegister: 'login' | 'register') => {
  try {
    const response = await axios.post(`/auth/${loginOrRegister}`, { username, password })
    return response
  } catch (error) {
    throw error
  }
}

export const logoutServices = async () => {
  try {
    await axios.post('/auth/logout')
  } catch (error) {
    throw error
  }
}

export const profileServices = async () => {
  try {
    const response = await axios.get('/auth/profile')
    return response.data
  } catch (error) {
    throw error
  }
}
