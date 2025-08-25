import { useEffect, useState } from 'react';
import { Toaster, Position } from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: Position.TOP,
});

export function UpdateAdminLoginComponent({ API ,setRefresh}) {
  const [usernameInput, setUsernameInput] = useState('');
  const [comfirmPassword, setComfirmPassword] = useState('');
  const [adminData, setAdminData] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnLoading1, setBtnLoading1] = useState(false);

  const fetchAdminLogin = () => {
    setBtnLoading(true);
    if (!usernameInput) {
      AppToaster.show({ message: 'Enter a username', intent: 'warning', timeout: 2000 });
      setBtnLoading(false);
      return;
    }

    fetch(`${API}/${usernameInput}`)
      .then((res) => {
        if (!res.ok) throw new Error('Admin not found');
        return res.json();
      })
      .then((data) => {
        setAdminData(data);
        setBtnLoading(false);
      })
      .catch((err) =>{
        if(err.message==='Admin not found')
          AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000 })
        else
          console.error('Error in Admin fetch! : ',err)
        setBtnLoading(false);
      });
  };

  const updateAdminLogin = () => {
    setBtnLoading1(true);
    if (adminData.password.length<8) {
      AppToaster.show({ message: 'Password must be atleast 8 Characters!', intent: 'warning', timeout: 3000 });
      setBtnLoading1(false);
      return;
    }

    if(adminData.password !== comfirmPassword) {
        AppToaster.show({
          message: 'Password Mismatch!',
          intent: 'warning',
          timeout: 2000,
        });
        setBtnLoading1(false);
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
        setBtnLoading1(false);
        return res.json();
      })
      .catch((err) =>{
        if(err.message==='Update failed')
          AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000 })
        else
          console.error('Error in Admin update : ',err)
        setBtnLoading1(false);
      });
  };

  return (
    <div className='crud-container'>
      <div className='label-input'>
        <label className='label'>Username:</label>
        <input className='input'
          value={usernameInput}
          placeholder='Enter username'
          onChange={(e) => setUsernameInput(e.target.value)}
          disabled={!!adminData}
        />
      </div>

      {!adminData && (
        <div>
          <button className='btn btn-primary btn-loading' onClick={fetchAdminLogin} disabled={btnLoading}>
            {btnLoading ? <span className="button-spinner"></span> : 'Search Admin'}
          </button>
        </div>
      )}

      {adminData && (
        <>
          <div className='label-input'>
            <label className='label'>Password :</label>
            <input className='input'
              value={adminData.password}
              onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
            />
          </div>
          <div className='label-input'>
            <label className='label'>Comfirm :</label>
            <input className='input'
              value={comfirmPassword}
              onChange={(e) => setComfirmPassword(e.target.value)}
              placeholder='Comfirm Password'
            />
          </div>

          <div>
            <button className='btn btn-success' onClick={updateAdminLogin} disabled={btnLoading1}>
              {btnLoading1 ? <span className="button-spinner"></span> : 'Update Admin'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}