import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, InputGroup, Toaster, Position } from '@blueprintjs/core';

import './../Styles/LoginStyle.css'

const AppToaster = Toaster.create({
  position: Position.TOP,
});

export function AdminLogin() {
  const navigate = useNavigate();
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch(`/api/login/admin/${username}`);
      if (!response.ok) {
        AppToaster.show({
          message: 'Username not found',
          intent: 'danger',
          timeout: 3000,
        });
        return;
      }

      const data = await response.json();

      if (data.password === password) {
        AppToaster.show({
          message: 'Login successful',
          intent: 'success',
          timeout: 800,
        });

        setTimeout(() => {
          navigate('/AdminMain');
        }, 1000);
      } else {
        AppToaster.show({
          message: 'Invalid password',
          intent: 'danger',
          timeout: 3000,
        });
      }
    } catch (err) {
      AppToaster.show({
        message: 'Login failed due to network error',
        intent: 'danger',
        timeout: 3000,
      });
    }
  };

  const goToStudentLogin = () => {
    navigate('/StudentLogin');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-title">
          <Button onClick={goToStudentLogin}>Student Login</Button>
          <Button className='selected'>Admin Login</Button>
        </div>
        <label className="login-label">
          Username <span className="required">*</span>
        </label>
        <InputGroup
          className="login-input"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
        />

        <label className="login-label">
          Password <span className="required">*</span>
        </label>
        <InputGroup
          className="login-input"
          rightElement={
            <Button
              minimal
              icon={showPassword ? 'eye-off' : 'eye-open'}
              onClick={() => setShowPassword((prev) => !prev)}
            />
          }
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="login-button" intent='primary' onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  );
}
