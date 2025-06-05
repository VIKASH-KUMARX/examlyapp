import { useState } from 'react';
import { Button, InputGroup, Position, Toaster} from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: Position.TOP,
})

export function AddAdminLoginComponent({API}) {

    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');

    function addAdminLogin() {
      if (newUsername.length > 0 && newPassword.length > 0) {
        const username = newUsername.trim();
        const password = newPassword.trim();
    
        if (username.length === 0 || password.length === 0) {
          AppToaster.show({
            message: 'Fields cannot contain only spaces!',
            intent: 'warning',
            timeout: 2000,
          });
          return;
        }
    
        // Check if username already exists
        fetch(`${API}/${username}`)
          .then((res) => {
            if (res.ok) {
              throw new Error(`Username "${username}" already exists`);
            }
            return addNewAdminLogin(username, password);
          })
          .catch((err) => {
            if (err.message === `Username "${username}" already exists`) {
              AppToaster.show({
                message: err.message,
                intent: 'warning',
                timeout: 2000,
              });
            } else {
              AppToaster.show({
                message: `Failed to verify student: ${err.message}`,
                intent: 'danger',
                timeout: 3000,
              });
            }
          });
    
      } else {
        AppToaster.show({
          message: 'All fields are required!',
          intent: 'warning',
          timeout: 2000,
        });
      }
    }
    
    // Helper function to add student
    async function addNewAdminLogin(loginid, password) {
      const response = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ loginid, password}),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      AppToaster.show({
        message: `Student ${data.loginid} added successfully!`,
        intent: 'success',
        timeout: 2000,
      });
      setNewUsername('');
      setNewPassword('');
    }
    

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
      <InputGroup
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
        placeholder="Enter new username"
      />
      <InputGroup
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password"
      />
      <Button intent="success" onClick={addAdminLogin}>
        Add Admin
      </Button>
    </div>    
    );
}