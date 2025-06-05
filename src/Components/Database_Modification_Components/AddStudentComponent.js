import { useState } from 'react';
import { Button, InputGroup, Position, Toaster} from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: Position.TOP,
})

export function AddStudentComponent({API}) {

    const [newRegNo, setRegNo] = useState('');
    const [newName, setNewName] = useState('');
    const [newCourses, setNewCourses] = useState('');

    function addStudent() {
      if (newRegNo.length > 0 && newName.length > 0 && newCourses.length > 0) {
        const regnum = newRegNo.trim();
        const name = newName.trim();
        let courses = newCourses.trim();
    
        if (regnum.length === 0 || name.length === 0 || courses.length === 0) {
          AppToaster.show({
            message: 'Fields cannot contain only spaces!',
            intent: 'warning',
            timeout: 2000,
          });
          return;
        }
    
        try {
          // Try to parse directly if user entered proper JSON array
          const parsedCourses = JSON.parse(courses);
          if (Array.isArray(parsedCourses)) {
            // Re-format to correct string (standardized)
            courses = JSON.stringify(parsedCourses.map((c) => c.trim()));
          } else {
            throw new Error();
          }
        } catch (err) {
          const courseArray = courses.split(',').map((c) => c.trim()).filter(c => c.length > 0);
          if (courseArray.length === 0) {
            AppToaster.show({
              message: 'Invalid courses input!',
              intent: 'danger',
              timeout: 2000,
            });
            return;
          }
          courses = JSON.stringify(courseArray);
        }
    
        // Check if regnum already exists
        fetch(`${API}/${regnum}`)
          .then((res) => {
            if (res.ok) {
              throw new Error(`Registration number "${regnum}" already exists`);
            }
            return addNewStudent(regnum, name, courses);
          })
          .catch((err) => {
            if (err.message === `Registration number "${regnum}" already exists`) {
              AppToaster.show({
                message: err.message,
                intent: 'warning',
                timeout: 2000,
              });
            } else {
              AppToaster.show({
                message: `Failed to verify student: ${err.message}`,
                intent: 'danger',
                timeout: 3000,
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
    
    // Helper function to add student
    async function addNewStudent(regnum, name, courses) {
      const response = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ regnum, name, courses }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      AppToaster.show({
        message: `Student ${data.name} added successfully!`,
        intent: 'success',
        timeout: 2000,
      });
      setRegNo('');
      setNewName('');
      setNewCourses('');
    }
    

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
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
        placeholder='Add courses'
        style={{ width: '300px' }}
      />
      <Button intent="success" onClick={addStudent}>
        Add Student
      </Button>
    </div>    
    );
}