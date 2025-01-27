import React, { useState } from 'react';
import { Button, Input, Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleLogin = async () => {
    const { username, password } = credentials;

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('jwt', data.access_token); 
      localStorage.setItem('role', data.role); 

      login(data.access_token, data.role);
      if (data.role === 'owner') {
        navigate('/owner-dashboard');
      } else if (data.role === 'manager') {
        navigate('/manager-dashboard');
      }

    } catch (error) {
      message.error('Login failed: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Restaurant Inventory Management</h2>
      <Form onFinish={handleLogin}>
        <Form.Item label="Username" required>
          <Input
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            placeholder="Enter your username"
          />
        </Form.Item>
        <Form.Item label="Password" required>
          <Input.Password
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            placeholder="Enter your password"
          />
        </Form.Item>
        <Button type="primary" htmlType="submit">Log In</Button>
      </Form>
    </div>
  );
};

export default Login;

