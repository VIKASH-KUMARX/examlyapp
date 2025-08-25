import { useEffect, useState } from 'react';
import Loader from '../loader';

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

  if (loading) return <Loader />;

  return (
    <div className='table-container'>
      <h2 className='title'> Student Logins </h2>
    { student && student.length>0 ?
    (<table className='table'>
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
    <h2 className='no-data-available'>No login Datas</h2>}
    </div>
  );
}