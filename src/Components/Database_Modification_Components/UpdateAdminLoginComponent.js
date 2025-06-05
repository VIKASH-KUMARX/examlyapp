import { useEffect, useState } from 'react';
import { Button, InputGroup, Toaster, Position } from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: Position.TOP,
});

export function UpdateAdminLoginComponent({ API }) {
  const [usernameInput, setUsernameInput] = useState('');
  const [adminData, setAdminData] = useState('');

  const fetchAdminLogin = () => {
    if (!usernameInput) {
      AppToaster.show({ message: 'Enter a username', intent: 'warning', timeout: 2000 });
      return;
    }

    fetch(`${API}/${usernameInput}`)
      .then((res) => {
        if (!res.ok) throw new Error('Admin not found');
        return res.json();
      })
      .then((data) => setAdminData(data))
      .catch((err) =>
        AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000 })
      );
  };

  const updateAdminLogin = () => {
    if (!adminData.password) {
      AppToaster.show({ message: 'All fields are required!', intent: 'warning', timeout: 2000 });
      return;
    }

    adminData.password = adminData.password.trim();

    if (adminData.password.length===0) {
      AppToaster.show({ message: 'All fields are required!', intent: 'warning', timeout: 2000 });
      return;
    }

    fetch(`${API}/${usernameInput}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Update failed');
        AppToaster.show({ message: 'Admin Login updated!', intent: 'success', timeout: 2000 })
        setUsernameInput('')
        setAdminData('')
        return res.json();
      })
      .catch((err) =>
        AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000 })
      );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <label style={{width: '80px'}}>Username :</label>
        <InputGroup
          value={usernameInput}
          placeholder='Enter username'
          onChange={(e) => setUsernameInput(e.target.value)}
          disabled={!!adminData}
        />
      </div>

      {!adminData && (
        <div>
          <Button intent="primary" onClick={fetchAdminLogin}>
            Search Admin
          </Button>
        </div>
      )}

      {adminData && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <label style={{width: '80px'}}>Password :</label>
            <InputGroup
              value={adminData.password}
              onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <Button intent="success" onClick={updateAdminLogin}>
              Update Admin
            </Button>
          </div>
        </>
      )}
    </div>
  );
}