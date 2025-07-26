import { useEffect, useState } from 'react';
import { Button, InputGroup, Toaster, Position } from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: Position.TOP,
});

export function UpdateAdminLoginComponent({ API ,setRefresh}) {
  const [usernameInput, setUsernameInput] = useState('');
  const [comfirmPassword, setComfirmPassword] = useState('');
  const [adminData, setAdminData] = useState('');

  useEffect(()=>{
    setComfirmPassword(adminData.password);
  },[adminData.password])

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
      .catch((err) =>{
        if(err.message==='Admin not found')
          AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000 })
        else
          console.error('Error in Admin fetch! : ',err)
      });
  };

  const updateAdminLogin = () => {
    if (adminData.password.length<8) {
      AppToaster.show({ message: 'Password must be atleast 8 Characters!', intent: 'warning', timeout: 3000 });
      return;
    }

    if(adminData.password !== comfirmPassword) {
        AppToaster.show({
          message: 'Password Mismatch!',
          intent: 'warning',
          timeout: 2000,
        });
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
        setUsernameInput('');
        setAdminData('');
        setComfirmPassword('');
        setRefresh(prev=>!prev);
        return res.json();
      })
      .catch((err) =>{
        if(err.message==='Update failed')
          AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000 })
        else
          console.error('Error in Admin update : ',err)
      });
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
          <div style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', gap:'12px'  }}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <label style={{width: '80px'}}>Password :</label>
              <InputGroup
                value={adminData.password}
                onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
              />
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <label style={{width: '80px'}}>Comfirm :</label>
              <InputGroup
                value={comfirmPassword}
                onChange={(e) => setComfirmPassword(e.target.value)}
                placeholder='Comfirm Password'
              />
            </div>
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