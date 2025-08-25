import { useState } from 'react';
import { Toaster, Position } from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: Position.TOP,
});

export function DeleteStudentComponent({ API ,setRefresh }) {
  const [regnumInput, setRegnumInput] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnLoading1, setBtnLoading1] = useState(false);

  const fetchStudent = () => {
    setBtnLoading(true);
    if (!regnumInput) {
      AppToaster.show({ message: 'Enter a regnum', intent: 'warning', timeout: 2000});
      setBtnLoading(false);
      return;
    }

    fetch(`${API}/${regnumInput}`)
      .then((res) => {
        if (!res.ok) throw new Error('Student not found');
        setBtnLoading(false);
        return res.json();
      })
      .then((data) => {
        setStudentData(data);
        setBtnLoading(false);
      })
      .catch((err) =>{
        if(err.message==='Student not found'){
          AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000})
        } else{
          console.error("error in student Fetch! : ",err);
        }
        setBtnLoading(false);
      });
  };

  const deleteStudent = () => {
    setBtnLoading1(true);
    fetch(`${API}/${regnumInput}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed');
        AppToaster.show({ message: 'Student deleted!', intent: 'success', timeout: 2000});
        setStudentData(null);
        setRegnumInput('');
        setRefresh(prev=>!prev);
        setBtnLoading1(false);
      })
      .catch((err) =>{
        if(err.message==='Delete failed')
          AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000})
        else
          console.error('Error in Student delete : ',err)
        setBtnLoading1(false);
      });
  };

  return (
    <div className='crud-container'>
      <div className='label-input'>
        <label className='label'>Regnum :</label>
        <input className='input'
          value={regnumInput}
          onChange={(e) => setRegnumInput(e.target.value)}
          placeholder="Enter Registration Number"
          disabled={!!studentData}
        />
      </div>

      {!studentData && (
        <div>
          <button className='btn btn-danger' onClick={fetchStudent} disabled={btnLoading} >
            {btnLoading ? <span className='button-spinner'></span> : 'Search Student'}
          </button>
        </div>
      )}

      {studentData && (
        <>
          <div className='label-input'>
            <label className='label'>Name :</label>
            <input className='input' value={studentData.name}  disabled />
          </div>

          <div>
            <button className='btn btn-danger' onClick={deleteStudent} disabled={btnLoading1} >
              {btnLoading1 ? <span className='button-spinner'></span> : 'Confirm Delete'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
