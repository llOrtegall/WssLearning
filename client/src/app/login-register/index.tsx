import { loginServices } from '../../services/auth.services';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

export default function LoginRegister() {
  const { login } = useAuth();
  const [loginOrRegister, setLoginOrRegister] = useState<'login' | 'register'>('login');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    try {
      const response = await loginServices(username, password, loginOrRegister);

      if(response.status === 201) {
        alert('User registered successfully');
        setLoginOrRegister('login');
        return;
      }

      if(response.status === 200) {
        await login();
      }
      
    } catch (error) {
      console.log(error)
    } finally{
      e.currentTarget.reset();
    }

  }

  return (
    <div>
      <h1>Login Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" />
        <input type="password" name="password" />
        <button type="submit">{loginOrRegister === 'login' ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setLoginOrRegister(loginOrRegister === 'login' ? 'register' : 'login')}>{loginOrRegister === 'login' ? 'Register' : 'Login'}</button>
    </div>
  )
}