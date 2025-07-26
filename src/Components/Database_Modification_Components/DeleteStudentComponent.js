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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <label style={{ width: '80px' }}>Regnum :</label>
        <InputGroup
          value={regnumInput}
          onChange={(e) => setRegnumInput(e.target.value)}
          placeholder="Enter Registration Number"
          style={{width:'300px'}}
          disabled={!!studentData}
        />
      </div>

      {!studentData && (
        <div>
          <Button intent="danger" onClick={fetchStudent}>
            Search Student
          </Button>
        </div>
      )}

      {studentData && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <label style={{ width: '80px' }}>Name :</label>
            <InputGroup value={studentData.name} style={{width:'300px'}}  disabled />
          </div>

          <div>
            <Button intent="danger" onClick={deleteStudent}>
              Confirm Delete
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
