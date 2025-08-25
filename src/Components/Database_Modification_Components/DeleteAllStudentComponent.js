import { Toaster, Position } from '@blueprintjs/core';
import { useState } from 'react';

const AppToaster = Toaster.create({
  position: Position.TOP,
});

export function DeleteAllStudentComponent({ API ,setRefresh }) {
  const [btnLoading, setBtnLoading] = useState(false);

  const deleteStudent = () => {
    setBtnLoading(true);
    fetch(API, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed');
        setRefresh(prev=>!prev);
        AppToaster.show({ message: 'All Student deleted!', intent: 'success', timeout: 2000});
        setBtnLoading(false);
      })
      .catch((err) =>{
        if(err.message==='Delete failed'){
          AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000})
        } else{
          console.error("error in All student delete : ",err);
        }
        setBtnLoading(false);
      });
  };

  return (
    <div className='crud-container'>
        <p style={{ marginBottom: '20px',fontWeight: 'bold' }}>
            Once confirmed, all student data will be permanently deleted and cannot be recovered.
        </p>
        <button className='btn btn-danger' onClick={deleteStudent} disabled={btnLoading}>
            {btnLoading ? <span className='button-spinner'></span> : 'Confirm Delete'}
        </button>
    </div>

  );
}