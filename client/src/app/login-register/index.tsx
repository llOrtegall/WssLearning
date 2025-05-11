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

      if (response.status === 201) {
        alert('User registered successfully');
        setLoginOrRegister('login');
        return;
      }

      if (response.status === 200) {
        await login();
      }

    } catch (error) {
      console.log(error)
    } finally {
      e.currentTarget.reset();
    }

  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Login Register</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {loginOrRegister === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <button
        onClick={() => setLoginOrRegister(loginOrRegister === 'login' ? 'register' : 'login')}
        className="mt-4 text-blue-500 hover:underline"
      >
        {loginOrRegister === 'login' ? 'Register' : 'Login'}
      </button>
    </div>
  );
}