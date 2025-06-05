import { useState } from 'react';
import { Button } from '@blueprintjs/core';

import { ViewLoginDBComponent } from '../../../Components/Database_Modification_Components/ViewLoginDBComponent';
import { AddAdminLoginComponent } from '../../../Components/Database_Modification_Components/AddAdminLoginComponent';
import { UpdateAdminLoginComponent } from '../../../Components/Database_Modification_Components/UpdateAdminLoginComponent';
import { DeleteAdminLoginComponent } from '../../../Components/Database_Modification_Components/DeleteAdminLoginComponent';

export function AdminLoginDB() {
  const API = "/api/login/admin";

  const [visibleComponent, setVisibleComponent] = useState(null);
  
  const handleClick = (component) => {
    setVisibleComponent(prev => (prev === component ? null : component));
  };

  return (
    <div>
      <div>
        <ViewLoginDBComponent API={API} />
      </div>
      <div style={{ display: 'flex', justifyContent:'center', gap: '10px', marginTop: '20px' }}>
        <Button intent="success" onClick={() => handleClick('add')}>Add</Button>
        <Button intent="primary" onClick={() => handleClick('update')}>Update</Button>
        <Button intent="danger" onClick={() => handleClick('delete')}>Delete</Button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        {visibleComponent === 'add' && <AddAdminLoginComponent API={API} />}
        {visibleComponent === 'update' && <UpdateAdminLoginComponent API={API} />}
        {visibleComponent === 'delete' && <DeleteAdminLoginComponent API={API} />}
      </div>
    </div>
  );
}
