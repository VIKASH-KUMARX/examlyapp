import { useState } from 'react';
import { Button, InputGroup, Toaster, Position } from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: Position.TOP,
});

export function UpdateStudentComponent({ API }) {
  const [regnumInput, setRegnumInput] = useState('');
  const [studentData, setStudentData] = useState(null);

  const fetchStudent = () => {
    if (!regnumInput) {
      AppToaster.show({ message: 'Enter a Registration Number', intent: 'warning', timeout: 2000 });
      return;
    }

    fetch(`${API}/${regnumInput}`)
      .then((res) => {
        if (!res.ok) throw new Error('Student not found');
        return res.json();
      })
      .then((data) => setStudentData(data))
      .catch((err) =>
        AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000 })
      );
  };

  const updateStudent = () => {
    if (!studentData.name || !studentData.courses) {
      AppToaster.show({ message: 'All fields are required!', intent: 'warning', timeout: 2000 });
      return;
    }

    studentData.name = studentData.name.trim();
    studentData.courses = studentData.courses.trim();

    if (studentData.name.length===0 || studentData.courses.length===0) {
      AppToaster.show({ message: 'All fields are required!', intent: 'warning', timeout: 2000 });
      return;
    }
    
    fetch(`${API}/${regnumInput}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Update failed');
        AppToaster.show({ message: 'Student updated!', intent: 'success', timeout: 2000 })
        setRegnumInput('')
        setStudentData(null)
        return res.json();
      })
      .catch((err) =>
        AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000 })
      );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <label style={{width: '80px'}}>Regnum :</label>
        <InputGroup
          value={regnumInput}
          onChange={(e) => setRegnumInput(e.target.value)}
          placeholder="Enter Registration Number"
          disabled={!!studentData}
          style={{ width: '300px' }}
        />
      </div>

      {!studentData && (
        <div>
          <Button intent="primary" onClick={fetchStudent}>
            Search Student
          </Button>
        </div>
      )}

      {studentData && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <label style={{width: '80px'}}>Name :</label>
            <InputGroup
              value={studentData.name}
              onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
              placeholder="Enter Name"
              style={{ width: '300px' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <label style={{width: '80px'}}>Courses :</label>
            <InputGroup
              value={studentData.courses}
              onChange={(e) => setStudentData({ ...studentData, courses: e.target.value })}
              placeholder="Add Courses"
              style={{ width: '300px' }}
            />
          </div>

          <div>
            <Button intent="success" onClick={updateStudent}>
              Update Student
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
