import { useState } from 'react';
import { Toaster, Position } from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: Position.TOP,
});

export function DeleteAdminLoginComponent({ API ,setRefresh}) {
  const [usernameInput, setUsernameInput] = useState('');
  const [adminLoginData, setAdminLoginData] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnLoading1, setBtnLoading1] = useState(false);

  const fetchAdminLogin = () => {
    setBtnLoading(true);
    if (!usernameInput) {
      AppToaster.show({ message: 'Enter a username', intent: 'warning', timeout: 2000});
      setBtnLoading(false);
      return;
    }

    fetch(`${API}/${usernameInput}`)
      .then((res) => {
        if (!res.ok) throw new Error('Admin not found');
        return res.json();
      })
      .then((data) => {
        setAdminLoginData(data);
        setBtnLoading(false);
      })
      .catch((err) =>{
        if(err.message==='Admin not found'){
          AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000})
        } else{
          console.error("error in admin Fetch! : ",err);
        }
        setBtnLoading(false);
      });
  };

  const deleteAdminLogin = () => {
    setBtnLoading1(true);
    fetch(`${API}/${usernameInput}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if(!res.ok) throw new Error('Delete failed');
        AppToaster.show({ message: 'Admin deleted', intent: 'success', timeout: 2000});
        setAdminLoginData(null);
        setUsernameInput('');
        setRefresh(prev=>!prev);
        setBtnLoading1(false);
      })
      .catch((err) =>{
        if(err.message==='Delete failed'){
          AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000})
        } else{
          console.error("Error in Admin delete : ",err);
        }
        setBtnLoading1(false);
      });
  };

  return (
    <div className='crud-container'>
      <div className='label-input'>
        <label className='label'>Username:</label>
        <input className='input'
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          placeholder="Enter username"
          disabled={!!adminLoginData}
        />
      </div>

      {!adminLoginData && (
        <div>
          <button className='btn btn-danger' onClick={fetchAdminLogin} disabled={btnLoading}>
            {btnLoading ? <span className="button-spinner"></span> : 'Search Admin'}
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
            <button className='btn btn-danger' onClick={deleteAdminLogin} disabled={btnLoading1} >
              {btnLoading1 ? <span className="button-spinner"></span> : 'Confirm Delete'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
