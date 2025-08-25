import { useEffect, useState } from 'react';
import Loader from '../loader';

export function ViewStudentsComponent({API, refresh, setDataLength}) {

  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(API)
      .then((response) => response.json())
      .then((json) => {
        setStudent(json); 
        setLoading(false); 
        setDataLength(json.length) 
      })
      .catch((error) =>{
        console.error("Error in studentDB Fetch! - ", error);
        setLoading(false);
        setDataLength(0)
      })
  }, [API,refresh]);

  if (loading) return <Loader />;

  return (
    <div className="table-container">
      <h2 className="title">
        {API.includes("yearone") && "First Year Students"}
        {API.includes("yeartwo") && "Secont Year Students"}
        {API.includes("yearthree") && "Third Year Students"}
        {API.includes("yearfour") && "Final Year Students"}
      </h2>
    {  student && student.length>0 ?
      (<table className="table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Reg_no</th>
            <th>Name</th>
            <th>Room_no</th>
            <th>Courses</th>
          </tr>
        </thead>
        <tbody>
          {student.map((user,index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.regnum}</td>
              <td>{user.name}</td>
              <td>
                {user.roomno && user.roomno.trim().length > 0 ? (
                  <select>
                    {user.roomno.split(',').map((room, index) => (
                      <option key={index}>{room.trim()}</option>
                    ))}
                  </select>
                ) : 'Not Allocated'}
              </td>
              <td>
                {user.courses && typeof user.courses === 'string' &&
                user.courses.toLowerCase() !== 'nil' &&
                user.courses !== '-' &&
                user.courses.trim() !== '' ? (
                  <select>
                    {user.courses.split(',').map((course, index) => (
                      <option key={index}>{course.trim().toUpperCase()}</option>
                    ))}
                  </select>
                ) : (
                  'No courses'
                )}
              </td>
            </tr>
          ))}
        </tbody> 
      </table>) : <span className='no-data-available'> No Students Data </span>
    }
    </div>
  );
}