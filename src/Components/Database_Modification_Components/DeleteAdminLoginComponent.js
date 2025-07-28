import { useState } from 'react';
import { Button, InputGroup, Toaster, Position } from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: Position.TOP,
});

export function DeleteAdminLoginComponent({ API ,setRefresh}) {
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
      .catch((err) =>{
        if(err.message==='Admin not found'){
          AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000})
        } else{
          console.error("error in admin Fetch! : ",err);
        }}
      );
  };

  const deleteAdminLogin = () => {
    fetch(`${API}/${usernameInput}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if(!res.ok) throw new Error('Delete failed');
        AppToaster.show({ message: 'Admin deleted', intent: 'success', timeout: 2000});
        setAdminLoginData(null);
        setUsernameInput('');
        setRefresh(prev=>!prev);
      })
      .catch((err) =>{
        if(err.message==='Delete failed'){
          AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000})
        } else{
          console.error("Error in Admin delete : ",err);
        }}
      );
  };

  return (
    <div className='crud-container'>
      <div className='label-input'>
        <label className='label'>Username :</label>
        <input className='input'
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          placeholder="Enter username"
          disabled={!!adminLoginData}
        />
      </div>

      {!adminLoginData && (
        <div>
          <button className='btn btn-danger' onClick={fetchAdminLogin}>
            Search Admin
          </button>
        </div>
      )}

      {adminLoginData && (
        <>
          <div className='label-input'>
            <label className='label'>Password :</label>
            <input className='input' value={adminLoginData.password} disabled />
          </div>

          <div>
            <button className='btn btn-danger' onClick={deleteAdminLogin}>
              Confirm Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
