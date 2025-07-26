import { useState } from 'react';
import { Button, InputGroup, Position, Toaster } from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: Position.TOP,
});

export function AddStudentComponent({ API , setRefresh}) {
  const [newRegNo, setRegNo] = useState('');
  const [newName, setNewName] = useState('');
  const newRoomNo = '';
  const [newCourses, setNewCourses] = useState('');

  function addStudent() {
    if (newRegNo.trim().length > 0 && newName.trim().length > 0 && newCourses.trim().length > 0) {
      const regnumRaw = newRegNo.trim();
      const regnum = Number(regnumRaw);
      const name = newName.trim();
      let courses = newCourses.trim();

      if (isNaN(regnum) || !Number.isSafeInteger(regnum)) {
        AppToaster.show({
          message: 'Invalid Reg No! Please enter a Number',
          intent: 'danger',
          timeout: 2000,
        });
        return;
      }

      const courseArray = courses
        .split(',')
        .map((c) => c.trim().toUpperCase())
        .filter((c) => c.length > 0);

      if (courseArray.length === 0) {
        AppToaster.show({
          message: 'Invalid course list. Enter comma-separated course codes.',
          intent: 'danger',
          timeout: 2000,
        });
        return;
      }

      courses = courseArray.join(',');

      fetch(`${API}/${regnum}`)
        .then((res) => {
          if (res.ok) {
            throw new Error(`Registration number "${regnum}" already exists`);
          } else if (res.status === 404) {
            return addNewStudent(regnum, name, newRoomNo, courses);
          } else {
            throw new Error(`Unexpected error while checking student: ${res.status}`);
          }
        })
        .catch((err) => {
          if (err.message.includes('already exists')) {
            AppToaster.show({
              message: err.message,
              intent: 'warning',
              timeout: 2000,
            });
          } else {
            console.error('Error checking existing student:', err.message || err);
            AppToaster.show({
              message: 'Failed to verify student!',
              intent: 'danger',
              timeout: 2000,
            });
          }
        });
    } else {
      AppToaster.show({
        message: 'All fields are required!',
        intent: 'warning',
        timeout: 2000,
      });
    }
  }

  async function addNewStudent(regnum, name, roomno, courses) {
    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ regnum, name, roomno, courses }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `HTTP error! Status: ${response.status}`);
      }

      AppToaster.show({
        message: `Student ${data.name} added successfully!`,
        intent: 'success',
        timeout: 2000,
      });

      setRegNo('');
      setNewName('');
      setNewCourses('');
      setRefresh(prev=>!prev);
    } catch (err) {
      console.error('Error adding student:', err.message || err);
      AppToaster.show({
        message: 'Add Failed!',
        intent: 'danger',
        timeout: 2000,
      });
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
        marginTop: '30px',
      }}
    >
      <InputGroup
        value={newRegNo}
        onChange={(e) => setRegNo(e.target.value)}
        placeholder="Enter new Reg_no"
        style={{ width: '300px' }}
      />
      <InputGroup
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="Enter new Name"
        style={{ width: '300px' }}
      />
      <InputGroup
        value={newCourses}
        onChange={(e) => setNewCourses(e.target.value)}
        placeholder="Add courses (comma separated)"
        style={{ width: '300px' }}
      />
      <Button intent="success" onClick={addStudent}>
        Add Student
      </Button>
    </div>
  );
}
