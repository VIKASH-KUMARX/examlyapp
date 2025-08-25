import { useState } from 'react';

import { ViewLoginDBComponent } from '../../../Components/Database_Modification_Components/ViewLoginDBComponent';
import { AddAdminLoginComponent } from '../../../Components/Database_Modification_Components/AddAdminLoginComponent';
import { UpdateAdminLoginComponent } from '../../../Components/Database_Modification_Components/UpdateAdminLoginComponent';
import { DeleteAdminLoginComponent } from '../../../Components/Database_Modification_Components/DeleteAdminLoginComponent';

export function AdminLoginDB() {
  const API = "/api/login/admin";

  const [visibleComponent, setVisibleComponent] = useState(null);
  const [refresh, setRefresh] = useState(true);
  
  const handleClick = (component) => {
    setVisibleComponent(prev => (prev === component ? null : component));
  };

  return (
    <div className='year-container'>
      <div>
        <ViewLoginDBComponent API={API} refresh={refresh} />
      </div>
      <div className='crud-btn-group'>
        <button className='btn btn-success' onClick={() => handleClick('add')}>Add</button>
        <button className='btn btn-primary' onClick={() => handleClick('update')}>Update</button>
        <button className='btn btn-danger' onClick={() => handleClick('delete')}>Delete</button>
      </div>
      
      <div className='component-container'>
        {visibleComponent === 'add' && <AddAdminLoginComponent API={API} setRefresh={setRefresh}/>}
        {visibleComponent === 'update' && <UpdateAdminLoginComponent API={API} setRefresh={setRefresh}/>}
        {visibleComponent === 'delete' && <DeleteAdminLoginComponent API={API} setRefresh={setRefresh}/>}
      </div>
    </div>
  );
}
