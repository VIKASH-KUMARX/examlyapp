import { useState } from 'react';
import { ViewStudentsComponent } from '../../../Components/Database_Modification_Components/ViewStudentsComponent';
import { AddStudentComponent } from '../../../Components/Database_Modification_Components/AddStudentComponent';
import { UpdateStudentComponent } from '../../../Components/Database_Modification_Components/UpdateStudentComponent';
import { DeleteStudentComponent } from '../../../Components/Database_Modification_Components/DeleteStudentComponent';
import { DeleteAllStudentComponent } from '../../../Components/Database_Modification_Components/DeleteAllStudentComponent';

export function YearTwoStudents() {
  const API = "api/yeartwostudent";

  const [visibleComponent, setVisibleComponent] = useState('add');
  const [refresh, setRefresh] = useState(true);
  const [dataLength, setDataLength] = useState(0);

  const handleClick = (component) => {
    setVisibleComponent(prev => (prev === component ? null : component));
  };

  return (
    <div className='year-container'>
      <div>
        <ViewStudentsComponent API={API} refresh={refresh} setDataLength={setDataLength}/>
      </div>

    {dataLength>0 &&
      (<><div className='crud-btn-group'>
        <button className='btn btn-success' onClick={() => handleClick('add')}>Add</button>
        <buton className='btn btn-primary' onClick={() => handleClick('update')}>Update</buton>
        <button className='btn btn-danger' onClick={() => handleClick('delete')}>Delete</button>
        <button className='btn btn-danger' onClick={() => handleClick('deleteAll')}>Delete All</button>
      </div>

      <div className='component-container'>
        {visibleComponent === 'add' && <AddStudentComponent API={API} setRefresh={setRefresh}/>}
        {visibleComponent === 'update' && <UpdateStudentComponent API={API} setRefresh={setRefresh}/>}
        {visibleComponent === 'delete' && <DeleteStudentComponent API={API} setRefresh={setRefresh}/>}
        {visibleComponent === 'deleteAll' && <DeleteAllStudentComponent API={API} setRefresh={setRefresh}/>}
      </div></>)
    }
    </div>
  );
}
