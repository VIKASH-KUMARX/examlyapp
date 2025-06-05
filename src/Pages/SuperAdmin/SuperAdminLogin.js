import React from 'react';
import { useNavigate } from 'react-router-dom';

export function SuperAdminLogin() {
  const navigate = useNavigate();

  const goToSuperAdminMain = () => {
    navigate('/SuperAdminMain');
  };

  return (
    <div>
      <h2>SuperAdmin Login Page</h2>
      <button onClick={goToSuperAdminMain}>SuperAdmin Login Submit Button</button>
    </div>
  );
}
