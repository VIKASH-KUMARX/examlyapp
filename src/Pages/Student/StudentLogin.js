import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, Position } from '@blueprintjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
          navigate(`/studentMain?API=api/${year}/${regno}`);
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
        message: 'Login failed due to network error, Please try again',
        intent: 'danger',
        timeout: 3000,
      });
      console.error("err in student login - ",err);
    }
  };

  const goToAdminLogin = () => {
    navigate('/adminLogin');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-title">
          <button className='selected'>Student Login</button>
          <button onClick={goToAdminLogin}>Admin Login</button>
        </div>
        <label className="login-label">
          Register number <span className="required">*</span>
        </label>
        <input
          className="login-input"
          placeholder="Enter Register Number"
          value={regno}
          onChange={(e) => setRegno(e.target.value)}
        />

        <label className="login-label">
          Password <span className="required">*</span>
        </label>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="eye-button"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
