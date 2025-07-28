import { useState } from 'react';
import { Button, InputGroup, Toaster, Position } from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: Position.TOP,
});

export function DeleteStudentComponent({ API ,setRefresh }) {
  const [regnumInput, setRegnumInput] = useState('');
  const [studentData, setStudentData] = useState(null);

  const fetchStudent = () => {
    if (!regnumInput) {
      AppToaster.show({ message: 'Enter a regnum', intent: 'warning', timeout: 2000});
      return;
    }

    fetch(`${API}/${regnumInput}`)
      .then((res) => {
        if (!res.ok) throw new Error('Student not found');
        return res.json();
      })
      .then((data) => setStudentData(data))
      .catch((err) =>{
        if(err.message==='Student not found'){
          AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000})
        } else{
          console.error("error in student Fetch! : ",err);
        }}
      );
  };

  const deleteStudent = () => {
    fetch(`${API}/${regnumInput}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed');
        AppToaster.show({ message: 'Student deleted!', intent: 'success', timeout: 2000});
        setStudentData(null);
        setRegnumInput('');
        setRefresh(prev=>!prev);
      })
      .catch((err) =>{
        if(err.message==='Delete failed')
          AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000})
        else
          console.error('Error in Student delete : ',err)
      }
      );
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
          <button className='btn btn-danger' onClick={fetchStudent}>
            Search Student
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
            <button className='btn btn-danger' onClick={deleteStudent}>
              Confirm Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
