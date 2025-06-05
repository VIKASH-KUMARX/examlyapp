import { useEffect, useState } from 'react';

export function ViewLoginDBComponent({API}) {

  const [student, setStudent] = useState([]);
  
  useEffect(() => {
    fetch(API)
      .then((response) => response.json())
      .then((json) => setStudent(json))
      .catch((error) => console.error("Error in Fetch!", error));
  }, []);

  return (
    <div className="App" style={{ display:'flex',justifyContent:'center' }}>
      <table className="bp4-html-table bp4-html-table-bordered bp4-html-table-striped bp4-html-table-truncated">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Reg_no</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {student.map((user,index) => (
            <tr key={index}>
              <td>{index +1}</td>
              <td>{user.loginid}</td>
              <td>{user.password}</td>
            </tr>
          ))}
        </tbody> 
      </table>
    </div>
  );
}