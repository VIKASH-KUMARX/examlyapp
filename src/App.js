import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './Pages/HomePage';
import { StudentLogin } from './Pages/Student/StudentLogin';
import { StudentMain } from './Pages/Student/StudentMain';
import { SuperAdminLogin } from './Pages/SuperAdmin/SuperAdminLogin';
import { SuperAdminMain } from './Pages/SuperAdmin/SuperAdminMain';
import { AdminLogin } from './Pages/Admin/AdminLogin';
import { AdminMain } from './Pages/Admin/AdminMain';
import { AdminStatus } from './Pages/Admin/AdminStatus';
import { HallSeatingAllocation } from './Pages/Admin/Hall_Seating_Allocation/HallSeatingAllocation';
import { DatabaseInitialization } from './Pages/Admin/DatabaseInitialization';
import { DatabaseModification } from './Pages/Admin/DatabaseModification';
import { YearOneStudents } from './Pages/Admin/Database_Modification/YearOneStudents';
import { YearTwoStudents } from './Pages/Admin/Database_Modification/YearTwoStudents';
import { YearThreeStudents } from './Pages/Admin/Database_Modification/YearThreeStudents';
import { YearFourStudents } from './Pages/Admin/Database_Modification/YearFourStudents';
import { FullCourseList } from './Pages/Admin/Database_Modification/FullCourseList';
import { StudentLoginDB } from './Pages/Admin/Database_Modification/StudentLoginDB';
import { AdminLoginDB } from './Pages/Admin/Database_Modification/AdminLoginDB';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/StudentLogin" element={<StudentLogin />} />
        <Route path="/StudentMain" element={<StudentMain />} />
        <Route path="/SuperAdminLogin" element={<SuperAdminLogin />} />
        <Route path="/SuperAdminMain" element={<SuperAdminMain />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/AdminMain" element={<AdminMain />} />
        <Route path="/AdminStatus" element={<AdminStatus />} />
        <Route path="/DatabaseInitialization" element={<DatabaseInitialization />} />
        <Route path="/HallSeatingAllocation" element={<HallSeatingAllocation />} />
        <Route path="/DatabaseModification" element={<DatabaseModification />} />
        <Route path="/YearOneStudents" element={<YearOneStudents />} />
        <Route path="/YearTwoStudents" element={<YearTwoStudents />} />
        <Route path="/YearThreeStudents" element={<YearThreeStudents />} />
        <Route path="/YearFourStudents" element={<YearFourStudents />} />
        <Route path="/FullCourseList" element={<FullCourseList />} />
        <Route path="/StudentLoginDB" element={<StudentLoginDB />} />
        <Route path="/AdminLoginDB" element={<AdminLoginDB />} />
      </Routes>
    </Router>
  );
}

export default App;




// import { useEffect, useState } from 'react';
// import { Alignment, Button, EditableText, InputGroup, Position, Toaster} from '@blueprintjs/core';
// import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// const AppToaster = Toaster.create({
//   position:"top"
// })

// function App() {

//   const [student, setStudent] = useState([]);
//   const [newRegNo, setRegNo] = useState([]);
//   const [newName, setNewName] = useState([]);
//   const [newEmail, setNewEmail] = useState([]);
//   const [newCourses, setNewCourses] = useState([]);

//   useEffect(() => {
//     fetch('api/yearonestudent')
//       .then((response) => response.json())
//       .then((json) => setStudent(json))
//       .catch((error) => console.error("Error in Fetch!", error));
//   }, []);

//   function addStudent() {
//     if (newRegNo.length>0 && newName.length>0 && newEmail.length>0) {
//       const regnum = newRegNo.trim();
//       const name = newName.trim();
//       const email = newEmail.trim();
      
//       if (regnum.length===0 || name.length===0 || email.length===0 ) {
//         AppToaster.show({
//           message: 'All fields are required!',
//           intent: 'warning',
//           timeout: 2000
//         });
//         setRegNo('');
//         setNewName('');
//         setNewEmail('');
//       }
//       else{
//       fetch('/api/yearonestudent', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json; charset=UTF-8'
//         },
//         body: JSON.stringify({
//           regnum,
//           name,
//           email,
//         })
//       })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         setStudent([...student, data]);
//         AppToaster.show({
//           message: 'Student added successfully!',
//           intent: 'success',
//           timeout: 2000
//         });
//         setRegNo('');
//         setNewName('');
//         setNewEmail('');
//         setNewCourses('');
//       })
//       .catch(error => {
//         AppToaster.show({
//           message: `Failed to add student: ${error.message}`,
//           intent: 'danger',
//           timeout: 3000
//         });
//       });
//     }}
//     else {
//       AppToaster.show({
//         message: 'All fields are required!',
//         intent: 'warning',
//         timeout: 2000
//       });
//     }
//   }  

//   return (
//     <div className="App">
//       <table className='bp4-html-table modifier'>
//         <thead>
//           <tr>
//             <th>sno</th>
//             <th>Reg_no</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Room_no</th>
//             <th>Courses</th>
//             {/* <th>Action</th> */}
//           </tr>
//         </thead>
//         <tbody>
//           {student.map(user =>
//             <tr key={user.sno}>
//               <td>{user.sno}</td>
//               <td>{user.regnum}</td>
//               <td>{user.name}</td>
//               <td>{user.email}</td>
//               <td>{user.roomno}</td>
//               <td>
//                 {user.courses && user.courses.length > 0
//                 ? <EditableText value={user.courses.map(course => course.coursename).join(', ')}/>
//                 : 'No courses'}
//               </td>
//               {/* <td>
//                 <Button intent='primary'>Update</Button>
//                 <Button intent='danger'>Delete</Button>
//               </td> */}
//             </tr>
//           )}
//         </tbody>
//         <tfoot>
//           <tr>
//             <td></td>
//             <td>
//               <InputGroup value={newRegNo}
//               onChange={(e)=>setRegNo(e.target.value)}
//               placeholder='Enter new Reg_no'
//             /></td>
//             <td>
//               <InputGroup value={newName}
//               onChange={(e)=>setNewName(e.target.value)}
//               placeholder='Enter new Name'
//             /></td>
//             <td>
//               <InputGroup value={newEmail}
//               onChange={(e)=>setNewEmail(e.target.value)}
//               placeholder='Enter new Email'
//             /></td>
//             <td></td>
//             <td></td>
//           </tr>
//           <tr>
//           <td style={{ display: 'flex', justifyContent: 'center'}}>
//             <Button 
//               intent='success' onClick={addStudent}> Add User 
//             </Button>
//           </td>
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   );
// }

// export default App;
