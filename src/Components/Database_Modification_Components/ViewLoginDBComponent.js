import { useEffect, useState } from 'react';

export function ViewLoginDBComponent({API, refresh}) {

  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(API)
      .then((response) => response.json())
      .then((json) =>{
        setStudent(json);
        setLoading(false)
      })
      .catch((error) =>{
        console.error("Error in LoginDB Fetch! - ", error);
        setLoading(false)
      });
  }, [API,refresh]);

  if (loading) return <p style={{alignContent:'center'}}>Loading courses...</p>;

  return (
    <div className="App" style={{ display:'flex',justifyContent:'center' }}>
    { student && student.length>0 ?
    (<table className="bp4-html-table bp4-html-table-bordered bp4-html-table-striped bp4-html-table-truncated">
        <thead>
          <tr>
            <th>S.No</th>
            <th>User Id</th>
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
      </table>)
    :
    <h1>No login Datas</h1>}
    </div>
  );
}