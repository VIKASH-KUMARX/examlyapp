import { useState } from 'react';
import { Button } from '@blueprintjs/core';
import { ViewStudentsComponent } from '../../../Components/Database_Modification_Components/ViewStudentsComponent';
import { AddStudentComponent } from '../../../Components/Database_Modification_Components/AddStudentComponent';
import { UpdateStudentComponent } from '../../../Components/Database_Modification_Components/UpdateStudentComponent';
import { DeleteStudentComponent } from '../../../Components/Database_Modification_Components/DeleteStudentComponent';
import { DeleteAllStudentComponent } from '../../../Components/Database_Modification_Components/DeleteAllStudentComponent';

export function YearTwoStudents() {
  const API = "api/yeartwostudent";

  const [visibleComponent, setVisibleComponent] = useState(null);

  const handleClick = (component) => {
    setVisibleComponent(prev => (prev === component ? null : component));
  };

  return (
      <di>
        <div>
          <ViewStudentsComponent API={API} />
        </div>
  
        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '30px', marginBottom: '50px' }}>
          <Button style={{width: '100%' }} intent="success" onClick={() => handleClick('add')}>Add</Button>
          <Button style={{width: '100%' }} intent="primary" onClick={() => handleClick('update')}>Update</Button>
          <Button style={{width: '100%' }} intent="danger" onClick={() => handleClick('delete')}>Delete</Button>
          <Button style={{width: '100%' }} intent="danger" onClick={() => handleClick('deleteAll')}>Delete All</Button>
        </div>
  
        <div style={{ paddingBottom: '20px' }}>
          {visibleComponent === 'add' && <AddStudentComponent API={API} />}
          {visibleComponent === 'update' && <UpdateStudentComponent API={API} />}
          {visibleComponent === 'delete' && <DeleteStudentComponent API={API} />}
          {visibleComponent === 'deleteAll' && <DeleteAllStudentComponent API={API} />}
        </div>
      </di>
    );
  }
