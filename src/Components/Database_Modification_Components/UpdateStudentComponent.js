import { useState } from 'react';
import { Button, InputGroup, Toaster, Position } from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: Position.TOP,
});

export function UpdateStudentComponent({ API ,setRefresh}) {
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
      .then((data) => {
        const cleanedCourses =
         typeof data.courses === 'string' ?
          data.courses.split(',').join(', ')
          : '';

        setStudentData({ ...data, courses: cleanedCourses });
      })
      .catch((err) =>{
        if(err.message==='Student not found')
          AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000 })
        else
          console.error('Error in Student fetch! : ',err)
      });
  };

  const updateStudent = () => {
    if (!studentData.name || !studentData.courses) {
      AppToaster.show({ message: 'All fields are required!', intent: 'warning', timeout: 2000 });
      return;
    }

    studentData.name = studentData.name.trim();
    studentData.courses = studentData.courses.split(',').map(c => c.trim()).filter(c => c.length > 0).join(',');

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
        setRefresh(prev=>!prev);
        return res.json();
      })
      .catch((err) =>{
        if(err.message==='Update failed')
          AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000 })
        else
          console.error('Error in Student update : ',err)
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
          <button className='btn btn-primary' onClick={fetchStudent}>
            Search Student
          </button>
        </div>
      )}

      {studentData && (
        <>
          <div className='label-input'>
            <label className='label'>Name :</label>
            <input className='input'
              value={studentData.name}
              onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
              placeholder="Enter Name"
            />
          </div>
          <div className='label-input'>
            <label className='label'>Courses :</label>
            <input className='input'
              value={studentData.courses}
              onChange={(e) => setStudentData({ ...studentData, courses: e.target.value })}
              placeholder="Add Courses"
            />
          </div>

          <div>
            <button className='btn btn-success' onClick={updateStudent}>
              Update Student
            </button>
          </div>
        </>
      )}
    </div>
  );
}
