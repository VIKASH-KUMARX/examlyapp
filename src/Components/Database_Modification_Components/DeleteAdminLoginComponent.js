import { useState } from 'react';
import { Button, InputGroup, Toaster, Position } from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: Position.TOP,
});

export function DeleteAdminLoginComponent({ API }) {
  const [usernameInput, setUsernameInput] = useState('');
  const [adminLoginData, setAdminLoginData] = useState(null);

  const fetchAdminLogin = () => {
    if (!usernameInput) {
      AppToaster.show({ message: 'Enter a username', intent: 'warning', timeout: 2000});
      return;
    }

    fetch(`${API}/${usernameInput}`)
      .then((res) => {
        if (!res.ok) throw new Error('Admin not found');
        return res.json();
      })
      .then((data) => setAdminLoginData(data))
      .catch((err) =>
        AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000})
      );
  };

  const deleteAdminLogin = () => {
    fetch(`${API}/${usernameInput}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed');
        AppToaster.show({ message: 'Admin deleted!', intent: 'success', timeout: 2000});
        setAdminLoginData(null);
        setUsernameInput('');
      })
      .catch((err) =>
        AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000})
      );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <label style={{ width: '80px' }}>Username :</label>
        <InputGroup
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          placeholder="Enter username"
          disabled={!!adminLoginData}
        />
      </div>

      {!adminLoginData && (
        <div>
          <Button intent="danger" onClick={fetchAdminLogin}>
            Search Admin
          </Button>
        </div>
      )}

      {adminLoginData && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <label style={{ width: '80px' }}>Password :</label>
            <InputGroup value={adminLoginData.password} disabled />
          </div>

          <div>
            <Button intent="danger" onClick={deleteAdminLogin}>
              Confirm Delete
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
