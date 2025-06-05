import { useEffect, useState } from 'react';

export function ViewStudentsComponent({API}) {

  const [student, setStudent] = useState([]);
  
  useEffect(() => {
    fetch(API)
      .then((response) => response.json())
      .then((json) => setStudent(json))
      .catch((error) => console.error("Error in Fetch!", error));
  }, []);

  return (
    <div className="App">
      <table className="bp4-html-table bp4-html-table-bordered bp4-html-table-striped bp4-html-table-truncated">
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
              <td>{user.roomno && user.roomno.length>0 ? user.roomno : 'Not Allocated'}</td>
              {/* <td>{user.courses && user.courses.length>0 ? JSON.parse(user.courses).join(', ') : 'No courses'}</td> */}
              <td>
                {user.courses !== 'Nil' && user.courses !== 'NIL' && user.courses !== 'nil' && user.courses && user.courses.length > 0 ? (
                <select>
                  {JSON.parse(user.courses).map((course, index) => (
                  <option key={index}>{course}</option>
                  ))}
                </select>
                ) : (
                'No courses'
                )}
              </td>
            </tr>
          ))}
        </tbody> 
      </table>
    </div>
  );
}