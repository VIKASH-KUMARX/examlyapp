import { ViewLoginDBComponent } from '../../../Components/Database_Modification_Components/ViewLoginDBComponent';

export function StudentLoginDB() {
  const API = "/api/login/student";

  return (
    <>
      <div>
        <ViewLoginDBComponent API={API} />
      </div>
    </>
  );
}
