import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, Position } from '@blueprintjs/core';

import './../Styles/LoginStyle.css'
import { AuthContext } from '../../Components/Authentication/Auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const AppToaster = Toaster.create({
  position: Position.TOP,
});

export function AdminLogin() {
  const navigate = useNavigate();
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setLogin } = useContext(AuthContext);

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
        setLogin(true);
        setTimeout(() => {
          navigate('/adminMain');
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
        message: 'Login failed due to network error Please try again',
        intent: 'danger',
        timeout: 3000,
      });
      console.error("err in admin login - ",err);
    }
  };

  const goToStudentLogin = () => {
    navigate('/studentLogin');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-title">
          <button onClick={goToStudentLogin}>Student Login</button>
          <button className='selected'>Admin Login</button>
        </div>
        <label className="login-label">
          Username <span className="required">*</span>
        </label>
        <input
          className="login-input"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
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
