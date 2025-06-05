import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, InputGroup, Toaster, Position } from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: Position.TOP,
});

export function StudentLogin() {
  const navigate = useNavigate();
  const [regno, setRegno] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch(`api/login/student/${regno}`);
      if (!response.ok) {
        AppToaster.show({
          message: 'Registration number not found',
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
          timeout:800
        });

        const year = data.year;

        setTimeout(() => {
          navigate(`/StudentMain?API=api/${year}/${regno}`);
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

  const goToAdminLogin = () => {
    navigate('/AdminLogin');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-title">
          <Button className='selected'>Student Login</Button>
          <Button onClick={goToAdminLogin}>Admin Login</Button>
        </div>
        <label className="login-label">
          Register number <span className="required">*</span>
        </label>
        <InputGroup
          className="login-input"
          placeholder="Enter Register Number"
          value={regno}
          onChange={(e) => setRegno(e.target.value)}
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
