import { useState } from 'react';
import { Position, Toaster} from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: Position.TOP,
})

export function AddAdminLoginComponent({API, setRefresh}) {

    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [comfirmPassword, setComfirmPassword] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);

    function addAdminLogin() 
    {
      setBtnLoading(true);
      const username = newUsername.trim();

      if(username.length === 0) {
        AppToaster.show({
          message: 'Username cannot be only space!',
          intent: 'warning',
          timeout: 2000,
        });
        setNewUsername('');
        setBtnLoading(false);
        return;
      }

      if(newPassword.length<8) {
        AppToaster.show({
          message: 'Password must be atleast 8 Characters',
          intent: 'warning',
          timeout: 3000,
        });
        setBtnLoading(false);
        return;
      }

      if(newPassword !== comfirmPassword) {
        AppToaster.show({
          message: 'Password Mismatch!',
          intent: 'warning',
          timeout: 2000,
        });
        setBtnLoading(false);
        return;
      }
    
      fetch(`${API}/${username}`)
        .then((res) => {
          if (res.ok) {
            throw new Error(`Username "${username}" already exists`);
          }
          return addNewAdminLogin(username, newPassword);
        })
        .catch((err) => {
          if (err.message === `Username "${username}" already exists`) {
            AppToaster.show({
              message: err.message,
              intent: 'warning',
              timeout: 2000,
            });
          } else {
            console.error("error in adminLogin Fetch? - ",err);
          }
          setBtnLoading(false);
        }
      );
    }
    
    async function addNewAdminLogin(loginid, password) {
      try{
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
      setComfirmPassword('');
      setRefresh(prev=>!prev);
      }catch(err){
        AppToaster.show({
          message: 'Add Failed!',
          intent: 'warning',
          timeout: 2000,
        });
        console.error("error in adding new admin : ",err.message || err);
      }finally{
        setBtnLoading(false);
      }
    }
    

    return (
      <div className='crud-container'>
      <input className='input'
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
        placeholder="Enter new username"
      />
      <input className='input'
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password"
      />
      <input className='input'
        value={comfirmPassword}
        onChange={(e)=> setComfirmPassword(e.target.value)}
        placeholder='Comfirm Password'
      />
      <button className='btn btn-success' onClick={addAdminLogin} disabled={btnLoading}>
        {btnLoading ? <span className="button-spinner"></span> : 'Add Admin'}
      </button>
    </div>    
    );
}